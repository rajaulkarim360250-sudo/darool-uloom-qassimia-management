const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/database');
const logger = require('./middleware/logger');
errorHandler = require('./middleware/errorHandler');

// এনভায়রনমেন্ট ভেরিয়েবল লোড করুন
dotenv.config();

// ডাটাবেস সংযুক্ত করুন
connectDB();

const app = express();

// মিডলওয়্যার
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// রুটস
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));
app.use('/api/income', require('./routes/income'));
app.use('/api/expense', require('./routes/expense'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/salary', require('./routes/salary'));
app.use('/api/reports', require('./routes/report'));

// হেলথ চেক
app.get('/api/health', (req, res) => {
  res.json({
    status: 'সফল',
    message: 'সার্ভার চলছে',
    timestamp: new Date()
  });
});

// ৪০৪ হ্যান্ডলার
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'পৃষ্ঠা পাওয়া যায়নি'
  });
});

// এরর হ্যান্ডলার
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`সার্ভার চলছে পোর্ট ${PORT} এ`);
  console.log(`পরিবেশ: ${process.env.NODE_ENV || 'development'}`);
  console.log(`${'='.repeat(50)}\n`);
});

module.exports = app;
