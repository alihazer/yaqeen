const express = require('express');
const router = express.Router();
const { createPrayer, getPrayers, getPrayer, editPrayer, deletePrayer } = require('../controllers/PrayerController.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

router.post('/', isLoggedIn ,createPrayer);
router.get('/', getPrayers);
router.get('/:id', getPrayer);
router.put('/:id', isLoggedIn, editPrayer);
router.delete('/:id', isLoggedIn, deletePrayer);

module.exports = router;    