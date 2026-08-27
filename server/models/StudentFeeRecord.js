const mongoose = require('mongoose');

const StudentFeeRecordSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  monthlyFee: {
    type: Number,
    default: 0
  },
  previousDue: {
    type: Number,
    default: 0
  },
  totalDue: Number,
  paid: {
    type: Number,
    default: 0
  },
  currentDue: Number,
  paymentDate: Date,
  receiptNumber: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// স্বয়ংক্রিয় গণনা
StudentFeeRecordSchema.pre('save', function(next) {
  this.totalDue = this.monthlyFee + this.previousDue;
  this.currentDue = this.totalDue - this.paid;
  next();
});

module.exports = mongoose.model('StudentFeeRecord', StudentFeeRecordSchema);
