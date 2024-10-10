const express = require('express');
const image=require('../middlewares/imagelogic.js')
const router = express.Router();

const { createAwar, getAwareness, getAwarenes,editAwarenes, deleteAwarenes  } = require('../controllers/AwarenessController.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

router.post('/', isLoggedIn ,image.single('image'),createAwar);
router.get('/', getAwareness);
router.get('/:id', getAwarenes);
router.put('/:id', isLoggedIn,image.single('image'), editAwarenes);
router.delete('/:id', isLoggedIn, deleteAwarenes);

module.exports = router;    