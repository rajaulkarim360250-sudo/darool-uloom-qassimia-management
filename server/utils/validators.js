// ভ্যালিডেশন হেল্পার ফাংশনসমূহ

const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

const validatePhoneNumber = (phone) => {
  const re = /^[0-9]{10,11}$/;
  return re.test(phone);
};

const validateStudentId = (id) => {
  return id && id.length > 0;
};

const validateAmount = (amount) => {
  return amount && !isNaN(amount) && amount > 0;
};

const validateDate = (date) => {
  return date && !isNaN(new Date(date).getTime());
};

module.exports = {
  validateEmail,
  validatePhoneNumber,
  validateStudentId,
  validateAmount,
  validateDate
};
