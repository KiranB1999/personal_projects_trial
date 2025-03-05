require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// MongoDB Schema
const blogSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Blog = mongoose.model('Blog', blogSchema);

// Routes
app.get('/', async (req, res) => {
    const posts = await Blog.find();
    res.render('index', { posts });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/add', async (req, res) => {
    const { title, content } = req.body;
    await Blog.create({ title, content });
    res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
