const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// লগইন
router.post('/login', authController.login);

// নিবন্ধন
router.post('/register', authController.register);

// লগআউট
router.post('/logout', authController.logout);

// পাসওয়ার্ড পরিবর্তন
router.put('/change-password', authController.changePassword);

module.exports = router;
