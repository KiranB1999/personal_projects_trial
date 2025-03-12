const express = require('express');
const router = express.Router();
const User = require('../models/user');
const PDFDocument = require('pdfkit');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a user
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });

    try {
        const newUser = await user.save();
        res.status(210).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add this route handler to your existing routes
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add PDF download route
router.get('/download-pdf', async (req, res) => {
    try {
        const users = await User.find();
        const doc = new PDFDocument();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text('Users List', { align: 'center' });
        doc.moveDown();

        users.forEach(user => {
            doc.fontSize(14).text(`Name: ${user.name}`);
            doc.fontSize(12).text(`Email: ${user.email}`);
            doc.fontSize(10).text(`Created: ${new Date(user.createdAt).toLocaleDateString()}`);
            doc.moveDown();
        });

        // Finalize the PDF
        doc.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;