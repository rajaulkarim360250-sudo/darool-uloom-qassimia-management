const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

// সকল আয় পান
router.get('/', incomeController.getAllIncomes);

// একটি আয় রেকর্ড পান
router.get('/:id', incomeController.getIncome);

// নতুন আয় যোগ করুন
router.post('/', incomeController.createIncome);

// আয় আপডেট করুন
router.put('/:id', incomeController.updateIncome);

// আয় রেকর্ড মুছুন
router.delete('/:id', incomeController.deleteIncome);

// তারিখ অনুযায়ী আয় পান
router.get('/date/:date', incomeController.getIncomeByDate);

// মাস অনুযায়ী আয় পান
router.get('/month/:month', incomeController.getIncomeByMonth);

// বিভাগ অনুযায়ী আয় পান
router.get('/category/:category', incomeController.getIncomeByCategory);

module.exports = router;
