/**
 * Users routes
 *
 * Handle all routes connected with users
 *
 * REGISTER   { Public }: api/users/register
 * LOGIN      { Public }: api/users/login
 * UPDATE     { Protected }: api/users/update
 *
 * GLOBAL RESPONSE:
 * @response {
 *   success: {Boolean},
 *   message: {String}
 * }
 *
 * @type {router}
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const keys = require('../config/keys.dev');
const tokenFormatter = require('../helpers/token-formatter');
const multer = require('multer');
const multerCfg = require('../config/multer');
const User = require('../models/User');

/**
 * LOGIN
 * @desc    Log the user in
 * @route   api/users/login
 * @access  Public
 * @method  POST
 * @headers {
 *   'Content-Type': 'application/json'
 * }
 * @body {
 *   email:    {String}
 *   password: {String}
 * }
 */
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if(!user) next({ message: 'User not found' });
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) next({ message: 'Invalid Password' });
          const payload = {
            id: user._id,
            name: user.name,
          };
          jwt.sign(
            payload,
            keys.jwtKey,
            { expiresIn: 604800 },
            (err, token) => {
              res.json({
                success: true,
                message: 'Login successful',
                data: {
                  user: {
                    name: user.name,
                    email: user.email,
                    id: user._id
                  },
                  token: `Bearer ${token}`
                }
              })
            });
        })
        .catch(err => next(err));
    });
});

/**
 * REGISTER
 * @desc    Register the user
 * @route   api/users/register
 * @access  Public
 * @method  POST
 * @headers {
 *   'Content-Type': 'application/json'
 * }
 * @body {
 *   name:     {String}
 *   email:    {String}
 *   password: {String}
 * }
 */
router.post('/register', (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then(user => {
      if(user) next({ message: 'User already exists' });
      const newUser = new User(req.body);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) next(err);
          newUser.password = hash;
          newUser.save()
            .then(user => res.json({
              success: true,
              message: 'User Created',
              data: {
                _id: user._id,
                name,
                email
              }
            }))
            .catch(err => next(err));
        })
      });
    });
});

/**
 * UPDATE
 * @desc    Update the user
 * @route   api/users/update
 * @access  Protected
 * @method  PATCH
 * @headers {
 *   'Content-Type': 'multipart/form-data',
 *   'Authorization': '<access_token>'
 * }
 * @body {
 *   _id:             {String} - MANDATORY (request will fail without it)
 *   name:            {String},
 *   password:        {String},
 *   email:           {String},
 *   secretQuestion:  {String},
 *   secretAnswer:    {String},
 *   hourlyRate:      {Number},
 *   registerDate:    {Date},
 *   role:            {String},
 *   avatar:          {File/String},
 *   localization:    {String},
 *   theme:           {String},
 *   allowExport:     {Boolean},
 *   activitySession: {Number}
 * }
 */
router.patch('/update', (req, res, next) => {
  const token = tokenFormatter(req.headers.authorization);
  jwt.verify(token, keys.jwtKey, (err) => {
    if(err) next({ message: 'You are not authorized' });
    const upload = multer({ storage: multerCfg.storage }).single('avatar');
    // Parse form-data object
    upload(req, res, err => {
      if(err) next(err);
      // Avatar is saved as an url string
      // If a new avatar is being sent trigger cloudinary api
      // and retrieve new avatar url after successful upload
      if(req.file) {
        const path = req.file.path;
        cloudinary.v2.uploader.upload(
          path,
          multerCfg.options(req.body._id),
          (err, image) => multerCfg.callback(err, image, req, res, path, next)
        );
      } else {
        User.findById(req.body._id, (err, user) => {
          if(err) next(err);
          Object.assign(user, req.body);
          user.save(err => {
            if(err) next(err);
            res.json({
              success: true,
              message: `User ${user.name} successfully updated`
            });
          });
        });
      }
    });
  });
});

module.exports = router;
