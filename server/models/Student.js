const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'ছাত্র আইডি প্রয়োজন'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'প্রথম নাম প্রয়োজন']
  },
  lastName: {
    type: String,
    required: [true, 'শেষ নাম প্রয়োজন']
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  guardianName: String,
  dateOfBirth: Date,
  bloodGroup: String,
  mobileNumber: {
    type: String,
    required: true
  },
  alternativeMobile: String,
  address: String,
  class: {
    type: String,
    required: [true, 'শ্রেণী প্রয়োজন']
  },
  section: String,
  branch: String,
  rollNumber: String,
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  residentialStatus: {
    type: String,
    enum: ['residential', 'day-scholar'],
    default: 'day-scholar'
  },
  monthlyFee: {
    type: Number,
    default: 0
  },
  admissionFee: {
    type: Number,
    default: 0
  },
  boardingFee: {
    type: Number,
    default: 0
  },
  otherFees: {
    type: Number,
    default: 0
  },
  profilePhoto: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'left'],
    default: 'active'
  },
  totalDue: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ভার্চুয়াল ফিল্ড - সম্পূর্ণ নাম
StudentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', StudentSchema);
