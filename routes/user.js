const express = require('express');
const {handleUserSignup, handleUserLogin} = require('../controllers/user');

const router = express.Router(); 

// /user 
router.post("/", handleUserSignup);
router.post("/login", handleUserLogin)

module.exports = router;