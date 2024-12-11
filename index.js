const express = require('express');
const { getAllArticles, getCategories, addArticle, getArticleById, updateArticle, deleteArticle } = require('./content-service'); // Make sure to import your DB functions
const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Get all articles
app.get('/articles', async (req, res) => {
    try {
        const articles = await getAllArticles();
        res.render('articles', { articles });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create article - GET route to show the form
app.get('/articles/create', async (req, res) => {
    try {
        const categories = await getCategories(); // Fetch categories to display in the dropdown
        res.render('create-article', { categories });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create article - POST route to save the article
app.post('/articles', async (req, res) => {
    const { title, content, category_id } = req.body;
    try {
        await addArticle(title, content, category_id); // Add article to DB
        res.redirect('/articles'); // Redirect to articles list after creating
    } catch (err) {
        res.status(500).send(err);
    }
});

// Edit article - GET route to show the form
app.get('/articles/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const article = await getArticleById(id); // Fetch the article by id
        const categories = await getCategories(); // Fetch categories to display in the dropdown
        res.render('edit-article', { article, categories });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Edit article - POST route to update the article
app.post('/articles/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, category_id } = req.body;
    try {
        await updateArticle(id, title, content, category_id); // Update the article in DB
        res.redirect('/articles'); // Redirect to articles list after updating
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete article
app.post('/articles/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteArticle(id); // Delete the article from DB
        res.redirect('/articles'); // Redirect to articles list after deleting
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
