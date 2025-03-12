const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Handle PDF upload and table extraction
router.post('/upload', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            error: 'No file uploaded' 
        });
    }

    const pythonScript = path.join(__dirname, '../pdf_extractor.py');
    const pythonProcess = spawn('python', [
        pythonScript,
        req.file.path
    ]);

    let result = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ 
                success: false, 
                error: errorOutput || 'Failed to process PDF' 
            });
        }
        try {
            // Clean up the uploaded file
            fs.unlinkSync(req.file.path);
            
            const tables = JSON.parse(result);
            res.json({
                success: true,
                tables: tables
            });
        } catch (e) {
            console.error('Parse error:', e);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to parse results' 
            });
        }
    });
});

module.exports = router;