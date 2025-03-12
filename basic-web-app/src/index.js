const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/files');

// Middleware
app.use(express.json());
app.use(express.static('public')); // Add this line to serve static files

// Routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Update the basic route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});