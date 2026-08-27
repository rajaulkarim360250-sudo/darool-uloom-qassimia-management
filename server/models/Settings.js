const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  institutionName: {
    type: String,
    default: 'দারুল উলূম কাছেমিয়া ক্বওমী মাদ্রাসা'
  },
  institutionAddress: String,
  mobileNumber: String,
  logo: String,
  seal: String,
  principalName: String,
  accountantName: String,
  auditOfficerName: String,
  financialYear: String,
  auditPeriod: {
    type: Number,
    default: 4
  },
  classes: [{
    type: String
  }],
  incomeCategories: [{
    type: String
  }],
  expenseCategories: [{
    type: String
  }],
  feeTypes: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
