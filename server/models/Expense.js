const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  voucherNumber: {
    type: String,
    required: [true, 'ভাউচার নম্বর প্রয়োজন'],
    unique: true
  },
  expenseCategory: {
    type: String,
    required: [true, 'ব্যয়ের ধরন প্রয়োজন'],
    enum: [
      'food',
      'teacher_salary',
      'staff_salary',
      'electricity',
      'gas',
      'water',
      'medical',
      'education_materials',
      'office_expense',
      'repair',
      'construction',
      'transport',
      'events',
      'other'
    ]
  },
  description: String,
  amount: {
    type: Number,
    required: [true, 'পরিমাণ প্রয়োজন'],
    min: [0, 'পরিমাণ শূন্যের বেশি হতে হবে']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'bank_transfer', 'online'],
    default: 'cash'
  },
  paidBy: String,
  approvedBy: String,
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
