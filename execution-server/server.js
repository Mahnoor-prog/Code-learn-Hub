const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json());

const TIMEOUT_MS = 10000; // 10 second timeout

function execPromise(command, options = {}) {
    return new Promise((resolve) => {
        exec(command, { timeout: TIMEOUT_MS, ...options }, (error, stdout, stderr) => {
            let exitCode = 0;
            if (error) {
                if (error.killed) {
                    stderr = (stderr ? stderr + '\n' : '') + '[Execution Timeout: 10 seconds exceeded]';
                    exitCode = 124; // Standard timeout exit code
                } else {
                    exitCode = error.code || 1;
                }
            }
            resolve({
                stdout: stdout || '',
                stderr: stderr || '',
                exitCode: exitCode
            });
        });
    });
}

app.post('/execute', async (req, res) => {
    const { language, code } = req.body;
    
    if (!language || !code) {
        return res.status(400).json({ error: 'language and code are required' });
    }

    const runId = uuidv4();
    const tempDir = path.join('/tmp', runId);

    try {
        // 1. Create temp folder
        await fs.mkdir(tempDir, { recursive: true });
        let result = null;

        // 2 & 3. Compile (if needed) and Execute
        if (language === 'python') {
            const filePath = path.join(tempDir, 'main.py');
            await fs.writeFile(filePath, code);
            result = await execPromise('python main.py', { cwd: tempDir });
        } 
        else if (language === 'csharp') {
            // Create console project and overwrite Program.cs
            await execPromise('dotnet new console', { cwd: tempDir });
            const filePath = path.join(tempDir, 'Program.cs');
            await fs.writeFile(filePath, code);
            result = await execPromise('dotnet run', { cwd: tempDir });
        } 
        else if (language === 'cpp') {
            const filePath = path.join(tempDir, 'main.cpp');
            await fs.writeFile(filePath, code);
            const compileResult = await execPromise('g++ main.cpp -o main', { cwd: tempDir });
            
            if (compileResult.exitCode !== 0) {
                result = compileResult; // Return compilation errors
            } else {
                result = await execPromise('./main', { cwd: tempDir });
            }
        } 
        else if (language === 'javascript') {
            const filePath = path.join(tempDir, 'app.js');
            await fs.writeFile(filePath, code);
            result = await execPromise('node app.js', { cwd: tempDir });
        } 
        else if (language === 'react') {
            const filePath = path.join(tempDir, 'App.jsx');
            await fs.writeFile(filePath, code);
            // Transpile JSX and pipe to node
            result = await execPromise('npx babel App.jsx --presets @babel/preset-react,@babel/preset-env | node', { cwd: tempDir });
        } 
        else {
            return res.status(400).json({ error: 'unsupported language' });
        }

        res.json(result);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    } finally {
        // 4. Delete temp folder
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch (cleanupErr) {
            console.error('Failed to cleanup temp directory:', cleanupErr);
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Execution server listening on port ${PORT}`);
});
