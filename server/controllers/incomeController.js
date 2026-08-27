const Income = require('../models/Income');

// সকল আয় পান
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// একটি আয় রেকর্ড পান
exports.getIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'আয় রেকর্ড পাওয়া যায়নি'
      });
    }
    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// নতুন আয় যোগ করুন
exports.createIncome = async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json({
      success: true,
      message: 'আয় রেকর্ড সফলভাবে যোগ হয়েছে',
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// আয় আপডেট করুন
exports.updateIncome = async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'আয় রেকর্ড পাওয়া যায়নি'
      });
    }
    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      message: 'আয় রেকর্ড সফলভাবে আপডেট হয়েছে',
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// আয় রেকর্ড মুছুন
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'আয় রেকর্ড পাওয়া যায়নি'
      });
    }
    res.status(200).json({
      success: true,
      message: 'আয় রেকর্ড সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// তারিখ অনুযায়ী আয় পান
exports.getIncomeByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const incomes = await Income.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// মাস অনুযায়ী আয় পান
exports.getIncomeByMonth = async (req, res) => {
  try {
    const incomes = await Income.find({
      $expr: {
        $eq: [
          { $dateToString: { format: '%Y-%m', date: '$date' } },
          req.params.month
        ]
      }
    });
    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// বিভাগ অনুযায়ী আয় পান
exports.getIncomeByCategory = async (req, res) => {
  try {
    const incomes = await Income.find({ incomeCategory: req.params.category });
    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
