/**
 * Handle errors and send a response message
 *
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {*|Promise<any>}
 */
module.exports = (err, req, res, next) => {
  return res.status(400).json({
    success: false,
    message: err.message
  });
};