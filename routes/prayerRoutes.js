const express = require('express');
const router = express.Router();
const { createPrayer, getPrayers, getPrayer } = require('../controllers/PrayerController.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

router.post('/', isLoggedIn ,createPrayer);
router.get('/', getPrayers);
router.get('/:id', getPrayer);

module.exports = router;    