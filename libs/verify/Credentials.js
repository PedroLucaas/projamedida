const isValidEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
const isValidPassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(password);
const isValidPhone = (phone) => /^[0-9]$/.test(phone);


module.exports = { isValidEmail, isValidPassword, isValidPhone };
