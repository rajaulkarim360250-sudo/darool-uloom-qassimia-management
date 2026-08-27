const mongoose = require('mongoose');

const BoardingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  month: {
    type: String,
    required: [true, 'মাস প্রয়োজন']
  },
  studentId: {
    type: String,
    required: [true, 'ছাত্র আইডি প্রয়োজন']
  },
  studentName: {
    type: String,
    required: true
  },
  class: String,
  foodBill: {
    type: Number,
    default: 0
  },
  otherCharges: {
    type: Number,
    default: 0
  },
  totalCharge: Number,
  paid: {
    type: Number,
    default: 0
  },
  previousDue: {
    type: Number,
    default: 0
  },
  totalDue: Number,
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
BoardingSchema.pre('save', function(next) {
  this.totalCharge = this.foodBill + this.otherCharges;
  this.totalDue = this.totalCharge + this.previousDue - this.paid;
  next();
});

module.exports = mongoose.model('Boarding', BoardingSchema);
