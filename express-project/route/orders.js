const express = require('express');
const { registerUser, loginUser } = require('../controller/authController');

const router = express.Router();

router.post('/place', registerUser);
router.post('/view', loginUser);


module.exports = router;