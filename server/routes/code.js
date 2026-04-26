import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/run', authenticate, async (req, res) => {
    try {
        const { language, code } = req.body;

        // Map frontend language names to our new local execution server aliases
        const languageMap = {
            'Python': 'python',
            'JavaScript': 'javascript',
            'C++': 'cpp',
            'Java': 'java', // Note: Java isn't supported by the new backend yet, will return unsupported error
            'C#': 'csharp',
            'React': 'react'
        };

        const executionLang = languageMap[language] || language.toLowerCase();

        // Call our new custom execution server instead of Piston
        const response = await axios.post('http://127.0.0.1:3000/execute', {
            language: executionLang,
            code: code
        });

        // Our server returns { stdout, stderr, exitCode }
        // The frontend IDE.jsx expects { output, error }
        res.json({
            output: response.data.stdout || '',
            error: response.data.stderr || '',
            details: response.data
        });

    } catch (err) {
        console.error('Code execution error:', err.message);
        const errorMsg = err.response?.data?.error || err.message;
        res.status(500).json({ error: 'Failed to execute code on sandbox server: ' + errorMsg });
    }
});

export default router;
