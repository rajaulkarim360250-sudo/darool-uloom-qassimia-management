const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// সকল ব্যয় পান
router.get('/', expenseController.getAllExpenses);

// একটি ব্যয় রেকর্ড পান
router.get('/:id', expenseController.getExpense);

// নতুন ব্যয় যোগ করুন
router.post('/', expenseController.createExpense);

// ব্যয় আপডেট করুন
router.put('/:id', expenseController.updateExpense);

// ব্যয় রেকর্ড মুছুন
router.delete('/:id', expenseController.deleteExpense);

// তারিখ অনুযায়ী ব্যয় পান
router.get('/date/:date', expenseController.getExpenseByDate);

// মাস অনুযায়ী ব্যয় পান
router.get('/month/:month', expenseController.getExpenseByMonth);

// বিভাগ অনুযায়ী ব্যয় পান
router.get('/category/:category', expenseController.getExpenseByCategory);

module.exports = router;
