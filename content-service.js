const { Pool } = require('pg');
require('dotenv').config();  // Load environment variables

// Initialize the connection pool for PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,        // Use your Neon database user
    host: process.env.DB_HOST,        // Use the Neon database host, e.g., "your-db-host.neon.tech"
    database: process.env.DB_NAME,    // Your database name
    password: process.env.DB_PASSWORD,// Your Neon database password
    port: process.env.DB_PORT || 5432,  // Default PostgreSQL port
    ssl: { rejectUnauthorized: false }  // SSL required for Neon
});

// Test the connection to the database
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connection successful:', res.rows);
    }
});

// Function to get all articles
module.exports.getAllArticles = async () => {
  try {
    const res = await pool.query('SELECT * FROM articles'); // SQL query to fetch all articles
    return res.rows;  // Return the rows from the query result
  } catch (err) {
    throw new Error('Error fetching articles: ' + err.message); // Handle query failure with better error handling
  }
};

// Function to get categories
module.exports.getCategories = async () => {
  try {
    const res = await pool.query('SELECT * FROM categories'); // SQL query to fetch all categories
    return res.rows;  // Return the rows
  } catch (err) {
    throw new Error('Error fetching categories: ' + err.message); // Handle query failure with better error handling
  }
};

// Function to get articles by category
module.exports.getArticlesByCategory = async (categoryId) => {
  try {
    const res = await pool.query('SELECT * FROM articles WHERE category_id = $1', [categoryId]);
    return res.rows;  // Return the rows for the given category
  } catch (err) {
    throw new Error('Error fetching articles by category: ' + err.message); // Handle query failure with better error handling
  }
};

// Function to add an article
module.exports.addArticle = async (title, content, categoryId) => {
  try {
    const res = await pool.query(
      'INSERT INTO articles (title, content, category_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, categoryId]
    );
    return res.rows[0]; // Return the newly inserted article
  } catch (err) {
    throw new Error('Error inserting article: ' + err.message); // Handle query failure with better error handling
  }
};

// Function to update an article
module.exports.updateArticle = async (id, title, content, categoryId) => {
  try {
    const res = await pool.query(
      'UPDATE articles SET title = $1, content = $2, category_id = $3 WHERE id = $4 RETURNING *',
      [title, content, categoryId, id]
    );
    return res.rows[0];  // Return the updated article
  } catch (err) {
    throw new Error('Error updating article: ' + err.message); // Handle query failure with better error handling
  }
};

// Function to delete an article
module.exports.deleteArticle = async (id) => {
  try {
    const res = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];  // Return the deleted article
  } catch (err) {
    throw new Error('Error deleting article: ' + err.message); // Handle query failure with better error handling
  }
};
