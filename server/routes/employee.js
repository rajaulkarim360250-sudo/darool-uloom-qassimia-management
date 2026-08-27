const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// সকল কর্মচারী পান
router.get('/', employeeController.getAllEmployees);

// একজন কর্মচারী পান
router.get('/:id', employeeController.getEmployee);

// নতুন কর্মচারী যোগ করুন
router.post('/', employeeController.createEmployee);

// কর্মচারীর তথ্য আপডেট করুন
router.put('/:id', employeeController.updateEmployee);

// কর্মচারী মুছুন
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
