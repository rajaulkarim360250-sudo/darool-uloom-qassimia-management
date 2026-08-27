const Salary = require('../models/Salary');

// সকল বেতন রেকর্ড পান
exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// একটি বেতন রেকর্ড পান
exports.getSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'বেতন রেকর্ড পাওয়া যায়নি'
      });
    }
    res.status(200).json({
      success: true,
      data: salary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// নতুন বেতন রেকর্ড যোগ করুন
exports.createSalary = async (req, res) => {
  try {
    const salary = new Salary(req.body);
    await salary.save();
    res.status(201).json({
      success: true,
      message: 'বেতন রেকর্ড সফলভাবে যোগ হয়েছে',
      data: salary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// বেতন আপডেট করুন
exports.updateSalary = async (req, res) => {
  try {
    let salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'বেতন রেকর্ড পাওয়া যায়নি'
      });
    }
    salary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      message: 'বেতন রেকর্ড সফলভাবে আপডেট হয়েছে',
      data: salary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// বেতন রেকর্ড মুছুন
exports.deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'বেতন রেকর্ড পাওয়া যায়নি'
      });
    }
    res.status(200).json({
      success: true,
      message: 'বেতন রেকর্ড সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// মাস অনুযায়ী বেতন পান
exports.getSalaryByMonth = async (req, res) => {
  try {
    const salaries = await Salary.find({ month: req.params.month });
    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// কর্মচারী অনুযায়ী বেতন পান
exports.getSalaryByEmployee = async (req, res) => {
  try {
    const salaries = await Salary.find({ employeeId: req.params.employeeId });
    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
