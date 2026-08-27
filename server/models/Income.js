const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  receiptNumber: {
    type: String,
    required: [true, 'রসিদ নম্বর প্রয়োজন'],
    unique: true
  },
  receiptPageNumber: String,
  incomeCategory: {
    type: String,
    required: [true, 'আয়ের ধরন প্রয়োজন'],
    enum: [
      'monthly_fee',
      'admission_fee',
      'boarding_fee',
      'donation',
      'subscription',
      'zakat',
      'fitr',
      'qurbani',
      'waqf',
      'other'
    ]
  },
  studentId: String,
  studentName: String,
  class: String,
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
  receivedBy: String,
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

module.exports = mongoose.model('Income', IncomeSchema);
