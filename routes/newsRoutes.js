const express = require('express');
const { getNews, createNews, getNewById, editNews, deleteNews } = require('../controllers/newsController.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');
const router = express.Router();

// Get all news
router.get('/', getNews);


// Create new news entry
router.post('/', isLoggedIn, createNews);
router.put('/:id', isLoggedIn, editNews);
router.delete('/:id', isLoggedIn, deleteNews);
router.get('/:id', getNewById);


module.exports = router;
