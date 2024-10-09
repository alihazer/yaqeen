const express = require('express');
const { getNews, createNews, getNewById } = require('../controllers/newsController.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');
const router = express.Router();

// Get all news
router.get('/', getNews);


// Create new news entry
router.post('/', isLoggedIn, createNews);
router.get('/:id', getNewById)

module.exports = router;
