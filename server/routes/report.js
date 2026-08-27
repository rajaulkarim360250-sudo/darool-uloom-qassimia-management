const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// দৈনিক রিপোর্ট
router.get('/daily/:date', reportController.getDailyReport);

// মাসিক রিপোর্ট
router.get('/monthly/:month', reportController.getMonthlyReport);

// চার মাসের রিপোর্ট
router.get('/quarterly/:startMonth', reportController.getQuarterlyReport);

// বার্ষিক রিপোর্ট
router.get('/annual/:year', reportController.getAnnualReport);

// দৈনিক নগদ হিসাব
router.get('/cash/:date', reportController.getDailyCashReport);

module.exports = router;
