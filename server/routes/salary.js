const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

// সকল বেতন রেকর্ড পান
router.get('/', salaryController.getAllSalaries);

// একটি বেতন রেকর্ড পান
router.get('/:id', salaryController.getSalary);

// নতুন বেতন রেকর্ড যোগ করুন
router.post('/', salaryController.createSalary);

// বেতন আপডেট করুন
router.put('/:id', salaryController.updateSalary);

// বেতন রেকর্ড মুছুন
router.delete('/:id', salaryController.deleteSalary);

// মাস অনুযায়ী বেতন পান
router.get('/month/:month', salaryController.getSalaryByMonth);

// কর্মচারী অনুযায়ী বেতন পান
router.get('/employee/:employeeId', salaryController.getSalaryByEmployee);

module.exports = router;
