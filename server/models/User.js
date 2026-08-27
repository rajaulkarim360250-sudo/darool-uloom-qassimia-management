const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'ব্যবহারকারীর নাম প্রয়োজন'],
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, 'ইমেইল প্রয়োজন'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'বৈধ ইমেইল প্রদান করুন']
  },
  password: {
    type: String,
    required: [true, 'পাসওয়ার্ড প্রয়োজন'],
    minlength: 6,
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'পূর্ণ নাম প্রয়োজন']
  },
  role: {
    type: String,
    enum: ['admin', 'accountant', 'teacher', 'user'],
    default: 'user'
  },
  permissions: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// পাসওয়ার্ড হ্যাশিং
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// পাসওয়ার্ড তুলনা করার মেথড
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
