import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/run', authenticate, async (req, res) => {
    try {
        const { language, code } = req.body;

        // Map frontend language names to Piston language names
        const languageMap = {
            'Python': 'python',
            'JavaScript': 'javascript',
            'C++': 'cpp',
            'Java': 'java',
            'C#': 'csharp',
            'React': 'javascript' // Map React to JS for basic execution (JSX won't compile without Babel on Piston)
        };

        const executionLang = languageMap[language] || language.toLowerCase();

        // Call the free public Piston API
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
            language: executionLang,
            version: '*', // Use latest available version
            files: [
                {
                    content: code
                }
            ]
        });

        // Piston v2 returns results in response.data.run
        const runResult = response.data.run || {};

        res.json({
            output: runResult.stdout || '',
            error: runResult.stderr || '',
            details: runResult
        });

    } catch (err) {
        console.error('Code execution error:', err.message);
        const errorMsg = err.response?.data?.message || err.message;
        res.status(500).json({ error: 'Failed to execute code on sandbox server: ' + errorMsg });
    }
});

export default router;
