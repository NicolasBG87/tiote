// Multer storage config
const User = require('../models/User');
const multer = require('multer');

module.exports = {
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  }),
  /**
   * Multer upload options
   *
   * @param {String} id
   * @returns {{format: string, transformation: {width: number, crop: string, height: number}[], public_id: string}}
   */
  options: id => {
    return {
      public_id: id,
      format: 'png',
      transformation: [
        { width: 100, height: 100, crop: 'fit' }
      ]
    }
  },
  /**
   * Cloudinary upload callback
   *
   * @param {Error} err
   * @param {File} image
   * @param {Request} req
   * @param {Response} res
   * @param {String} path
   * @param {Function} next
   * @returns {Response}
   */
  callback: (err, image, req, res, path, next) => {
    if(err) return res.send(err);
    const fs = require('fs');
    // Remove file from storage
    fs.unlinkSync(path);
    User.findById(req.body._id, (err, user) => {
      if(err) next(err);
      Object.assign(user, req.body);
      user.avatar = image.url;
      user.save(err => {
        if(err) next(err);
        res.json({
          success: true,
          message: `User ${user.name} successfully updated`
        });
      });
    });
  }
};