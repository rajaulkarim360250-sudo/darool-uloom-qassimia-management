const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  month: {
    type: String,
    required: [true, 'মাস প্রয়োজন']
  },
  employeeId: {
    type: String,
    required: [true, 'কর্মচারী আইডি প্রয়োজন']
  },
  employeeName: {
    type: String,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    default: 0
  },
  otherAllowances: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  totalAmount: Number,
  paidAmount: {
    type: Number,
    default: 0
  },
  due: Number,
  paidDate: Date,
  approvedBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// টোটাল এবং ডিউ স্বয়ংক্রিয় গণনা
SalarySchema.pre('save', function(next) {
  this.totalAmount = this.baseSalary + this.bonus + this.otherAllowances - this.deductions;
  this.due = this.totalAmount - this.paidAmount;
  next();
});

module.exports = mongoose.model('Salary', SalarySchema);
