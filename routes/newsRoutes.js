const express = require('express');
const { getNews, createNews } = require('../controllers/newsController.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');
const router = express.Router();

// Get all news
router.get('/', getNews);


// Create new news entry
router.post('/', isLoggedIn, createNews);

module.exports = router;
