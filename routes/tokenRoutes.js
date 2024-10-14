const express = require("express");
const { createToken, updateToken } = require("../controllers/tokenController");
const router = express.Router();


router.post('/', createToken);
router.put('/', updateToken)

module.exports = router;