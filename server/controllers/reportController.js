const Income = require('../models/Income');
const Expense = require('../models/Expense');

// দৈনিক রিপোর্ট
exports.getDailyReport = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const endDate = new Date(date.setHours(23, 59, 59, 999));

    const incomes = await Income.find({
      date: { $gte: startDate, $lt: endDate }
    });
    const expenses = await Expense.find({
      date: { $gte: startDate, $lt: endDate }
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netAmount = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      date: req.params.date,
      totalIncome,
      totalExpense,
      netAmount,
      incomeDetails: incomes,
      expenseDetails: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// মাসিক রিপোর্ট
exports.getMonthlyReport = async (req, res) => {
  try {
    const incomes = await Income.find({
      $expr: {
        $eq: [
          { $dateToString: { format: '%Y-%m', date: '$date' } },
          req.params.month
        ]
      }
    });
    const expenses = await Expense.find({
      $expr: {
        $eq: [
          { $dateToString: { format: '%Y-%m', date: '$date' } },
          req.params.month
        ]
      }
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netAmount = totalIncome - totalExpense;

    // বিভাগ অনুযায়ী বিস্তারিত
    const incomeByCategory = {};
    incomes.forEach(income => {
      incomeByCategory[income.incomeCategory] = (incomeByCategory[income.incomeCategory] || 0) + income.amount;
    });

    const expenseByCategory = {};
    expenses.forEach(expense => {
      expenseByCategory[expense.expenseCategory] = (expenseByCategory[expense.expenseCategory] || 0) + expense.amount;
    });

    res.status(200).json({
      success: true,
      month: req.params.month,
      totalIncome,
      totalExpense,
      netAmount,
      incomeByCategory,
      expenseByCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// চার মাসের রিপোর্ট
exports.getQuarterlyReport = async (req, res) => {
  try {
    // চার মাস সংগ্রহ করুন
    const months = [];
    const startDate = new Date(req.params.startMonth);
    for (let i = 0; i < 4; i++) {
      months.push(startDate.toISOString().substring(0, 7));
      startDate.setMonth(startDate.getMonth() + 1);
    }

    let totalIncome = 0;
    let totalExpense = 0;

    for (const month of months) {
      const incomes = await Income.find({
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m', date: '$date' } },
            month
          ]
        }
      });
      const expenses = await Expense.find({
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m', date: '$date' } },
            month
          ]
        }
      });

      totalIncome += incomes.reduce((sum, income) => sum + income.amount, 0);
      totalExpense += expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    res.status(200).json({
      success: true,
      quarter: req.params.startMonth,
      months,
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// বার্ষিক রিপোর্ট
exports.getAnnualReport = async (req, res) => {
  try {
    const year = req.params.year;
    const incomes = await Income.find({
      $expr: {
        $eq: [
          { $dateToString: { format: '%Y', date: '$date' } },
          year
        ]
      }
    });
    const expenses = await Expense.find({
      $expr: {
        $eq: [
          { $dateToString: { format: '%Y', date: '$date' } },
          year
        ]
      }
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.status(200).json({
      success: true,
      year,
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// দৈনিক নগদ হিসাব
exports.getDailyCashReport = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const endDate = new Date(date.setHours(23, 59, 59, 999));

    const incomes = await Income.find({
      date: { $gte: startDate, $lt: endDate },
      paymentMethod: 'cash'
    });
    const expenses = await Expense.find({
      date: { $gte: startDate, $lt: endDate },
      paymentMethod: 'cash'
    });

    const totalCashIn = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalCashOut = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const closingBalance = totalCashIn - totalCashOut;

    res.status(200).json({
      success: true,
      date: req.params.date,
      totalCashIn,
      totalCashOut,
      closingBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
