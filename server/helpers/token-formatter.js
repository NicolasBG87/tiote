/**
 * Format access_token to allow passport to decrypt it
 * Bearer <token string> => <token string>
 *
 * @param {String} token - Gotten from request headers [Authorization]
 * @returns {String}
 */
module.exports = token => {
  if (token.startsWith('Bearer ')) return token.slice(7, token.length);
};