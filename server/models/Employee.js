const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'কর্মচারী আইডি প্রয়োজন'],
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'পূর্ণ নাম প্রয়োজন']
  },
  position: {
    type: String,
    required: [true, 'পদ প্রয়োজন']
  },
  mobileNumber: {
    type: String,
    required: true
  },
  address: String,
  joiningDate: {
    type: Date,
    required: true
  },
  baseSalary: {
    type: Number,
    required: [true, 'মূল বেতন প্রয়োজন']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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

module.exports = mongoose.model('Employee', EmployeeSchema);
