const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// সকল ছাত্র পান
router.get('/', studentController.getAllStudents);

// একজন ছাত্র পান
router.get('/:id', studentController.getStudent);

// নতুন ছাত্র যোগ করুন
router.post('/', studentController.createStudent);

// ছাত্রের তথ্য আপডেট করুন
router.put('/:id', studentController.updateStudent);

// ছাত্র মুছুন
router.delete('/:id', studentController.deleteStudent);

// শ্রেণী অনুযায়ী ছাত্র পান
router.get('/class/:className', studentController.getStudentsByClass);

module.exports = router;
