/**
 * Validates the password and returns message if invalid
 *
 * @param {String} password
 * @returns {String}
 */
module.exports = (password) => {
  let message = '';
  if(password.length < 8) return message = 'Password must be at least 8 character long';
  if(password.length > 25) return message = 'Password must be at most 25 characters long';
  if(!/[A-Z]/.test(password)) return message = 'Password must have at least one uppercase letter';
  if(!/[a-z]/.test(password)) return message = 'Password must have at least one lowercase letter';
  if(!/\d/.test(password)) return message = 'Password must have at least one number';

  return message;
};