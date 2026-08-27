const User = require('../models/User');
const jwt = require('jsonwebtoken');

// লগইন
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ব্যবহারকারী খুঁজুন
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'অবৈধ ব্যবহারকারীর নাম বা পাসওয়ার্ড'
      });
    }

    // পাসওয়ার্ড যাচাই করুন
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'অবৈধ ব্যবহারকারীর নাম বা পাসওয়ার্ড'
      });
    }

    // JWT টোকেন তৈরি করুন
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // শেষ লগইন সময় আপডেট করুন
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'লগইন সফল',
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// নিবন্ধন
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    // নতুন ব্যবহারকারী তৈরি করুন
    const user = new User({
      username,
      email,
      password,
      fullName,
      role: role || 'user'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'ব্যবহারকারী সফলভাবে তৈরি হয়েছে',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// লগআউট
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'লগআউট সফল'
  });
};

// পাসওয়ার্ড পরিবর্তন
exports.changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ব্যবহারকারী পাওয়া যায়নি'
      });
    }

    // পুরানো পাসওয়ার্ড যাচাই করুন
    const isPasswordMatch = await user.matchPassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'পুরানো পাসওয়ার্ড সঠিক নয়'
      });
    }

    // নতুন পাসওয়ার্ড সেট করুন
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
