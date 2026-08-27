// সাধারণ ইউটিলিটি ফাংশনসমূহ

// তারিখ ফরম্যাট করুন
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// মাস পান (YYYY-MM ফরম্যাটে)
const getMonth = (date) => {
  const d = new Date(date);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
};

// সংখ্যা বাংলায় রূপান্তর করুন
const convertToBengaliNumber = (num) => {
  const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (digit) => bengaliNumbers[digit]);
};

// মুদ্রা ফরম্যাট করুন
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(amount);
};

// ইউনিক আইডি জেনারেট করুন
const generateUniqueId = (prefix) => {
  return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
};

module.exports = {
  formatDate,
  getMonth,
  convertToBengaliNumber,
  formatCurrency,
  generateUniqueId
};
