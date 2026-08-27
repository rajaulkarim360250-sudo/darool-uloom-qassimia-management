const Expense = require('../models/Expense');

// সকল ব্যয় পান
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// একটি ব্যয় রেকর্ড পান
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'ব্যয় রেকর্ড পাওয়া যায়নি'
      });
    }
    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// নতুন ব্যয় যোগ করুন
exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({
      success: true,
      message: 'ব্যয় রেকর্ড সফলভাবে যোগ হয়েছে',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ব্যয় আপডেট করুন
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'ব্যয় রেকর্ড পাওয়া যায়নি'
      });
    }
    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      message: 'ব্যয় রেকর্ড সফলভাবে আপডেট হয়েছে',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ব্যয় রেকর্ড মুছুন
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'ব্যয় রেকর্ড পাওয়া যায়নি'
      });
    }
    res.status(200).json({
      success: true,
      message: 'ব্যয় রেকর্ড সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// তারিখ অনুযায়ী ব্যয় পান
exports.getExpenseByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const expenses = await Expense.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// মাস অনুযায়ী ব্যয় পান
exports.getExpenseByMonth = async (req, res) => {
  try {
    const expenses = await Expense.find({
      $expr: {
        $eq: [
          { $dateToString: { format: '%Y-%m', date: '$date' } },
          req.params.month
        ]
      }
    });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// বিভাগ অনুযায়ী ব্যয় পান
exports.getExpenseByCategory = async (req, res) => {
  try {
    const expenses = await Expense.find({ expenseCategory: req.params.category });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
