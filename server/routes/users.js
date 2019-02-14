/**
 * Users routes
 *
 * Handle all routes connected with users
 *
 * GLOBAL RESPONSE:
 * @response {
 *   success: {Boolean}
 *   message: {String}
 *   data:    {Object}
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
const pwValidator = require('../helpers/pw-validator');

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const mailTemplate = require('../email/email-template');
sgMail.setApiKey(keys.sendGrid);


/**
 * LOGIN
 *
 * @route   api/users/login
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
  const {email, password} = req.body;
  User.findOne({email})
  .then(user => {
    if (!user) return next({message: 'User not found'});
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if (!isMatch) return next({message: 'Invalid Password'});
      if (!user.verified) return next({message: 'Account not verified'});
      const payload = {
        id: user._id,
        name: user.name,
      };
      jwt.sign(
        payload,
        keys.jwtKey,
        {expiresIn: 604800},
        (err, token) => {
          return res.json({
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
 * VERIFY
 *
 * @route   api/users/verify
 * @method  POST
 * @headers {
 *   'Content-Type': 'application/json'
 * }
 * @body {
 *   id:    {String}
 *   email: {String}
 * }
 */
router.post('/verify', (req, res, next) => {
  const {_id, email} = req.body;
  User.findOne({_id})
  .then(user => {
    if (!user) return next({message: 'User not found'});
    if (email !== user.email) return next({message: `User ${user.email} is not authorized`});
    user.verified = true;
    user.save()
    .then(user => res.json({
      success: true,
      message: `User ${user.name} successfully verified`
    }))
    .catch(err => next(err));
  });
});

/**
 * REGISTER
 *
 * @route   api/users/register
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
  const {name, email, password} = req.body;
  User.findOne({email})
  .then(user => {
    if (user) return next({message: 'User already exists'});
    const isPasswordValid = pwValidator(password);
    if (isPasswordValid !== '') return next({message: isPasswordValid});
    const newUser = new User(req.body);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return next(err);
        sgMail.send(mailTemplate(req.body, newUser, 'verify')).catch(err => next(err));
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
      });
    });
  })
  .catch(err => next(err));
});

/**
 * UPDATE
 *
 * @route   api/users/update
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
    if (err) return next({message: 'You are not authorized'});
    const upload = multer({storage: multerCfg.storage}).single('avatar');
    // Parse form-data object
    upload(req, res, err => {
      if (err) return next(err);
      // Avatar is saved as an url string
      // If a new avatar is being sent trigger cloudinary api
      // and retrieve new avatar url after successful upload
      if (req.file) {
        const path = req.file.path;
        cloudinary.v2.uploader.upload(
          path,
          multerCfg.options(req.body._id),
          (err, image) => multerCfg.callback(err, image, req, res, path, next)
        );
      } else {
        User.findById(req.body._id, (err, user) => {
          if (err) return next(err);
          Object.assign(user, req.body);
          user.save(err => {
            if (err) return next(err);
            return res.json({
              success: true,
              message: `User ${user.name} successfully updated`
            });
          });
        });
      }
    });
  });
});

/**
 * CHANGE PASSWORD
 *
 * @route   api/users/changepassword
 * @method  PATCH
 * @headers {
 *   'Content-Type': 'application/json',
 *   'Authorization': '<access_token>'
 * }
 * @body {
 *   _id:                {String} - MANDATORY (request will fail without it)
 *   password:           {String},
 *   newPassword:        {String},
 *   newPasswordConfirm: {String},
 *   email:              {String},
 *   secretQuestion:     {String},
 *   secretAnswer:       {String},
 * }
 */
router.patch('/changepassword', (req, res, next) => {
  const token = tokenFormatter(req.headers.authorization);
  jwt.verify(token, keys.jwtKey, (err) => {
    const {_id, email, password, newPassword, newPasswordConfirm, secretQuestion, secretAnswer} = req.body;
    if (err) return next({message: 'You are not authorized'});
    User.findById(_id, (err, user) => {
      if (err) return next(err);
      bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (!isMatch) return next({message: 'Invalid Password'});
        if (email !== user.email) return next({message: 'Entered email doesn\'t match'});
        if (
          secretQuestion !== user.secretQuestion ||
          secretAnswer !== user.secretAnswer
        ) return next({message: 'Secret Question and/or Answer are invalid'});
        const isPasswordValid = pwValidator(newPassword);
        if (isPasswordValid !== '') return next({message: isPasswordValid});
        if (newPassword !== newPasswordConfirm) return next({message: 'New Password and New Password Confirm do not match'});
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            user.save()
            .then(() => res.json({
              success: true,
              message: 'Password successfully updated.'
            }))
            .catch(err => next(err));
          })
        });
      });
    });
  });
});

/**
 * CHANGE EMAIL
 *
 * @route   api/users/changeemail
 * @method  POST
 * @headers {
 *   'Content-Type': 'application/json',
 *   'Authorization': '<access_token>'
 * }
 * @body {
 *   _id:                {String} - MANDATORY (request will fail without it)
 *   password:           {String}
 *   email:              {String}
 *   newEmail:           {String}
 *   secretQuestion:     {String}
 *   secretAnswer:       {String}
 * }
 */
router.post('/changeemail', (req, res, next) => {
  const token = tokenFormatter(req.headers.authorization);
  jwt.verify(token, keys.jwtKey, (err) => {
    const {_id, password, secretQuestion, secretAnswer, newEmail} = req.body;
    if (err) return next({message: 'You are not authorized'});
    User.findOne({newEmail})
    .then((err, user) => {
      if (err) return next(err);
      if (user) return next({message: 'Email already taken'});
      User.findById(_id, (err, user) => {
        if (err) return next(err);
        bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return next({message: 'Invalid Password'});
          if (
            secretQuestion !== user.secretQuestion ||
            secretAnswer !== user.secretAnswer
          ) return next({message: 'Secret Question and/or Answer are invalid'});
          sgMail.send(mailTemplate(req.body, user, 'changeEmail'));
          res.json({
            success: true,
            message: 'Email change requested'
          });
        });
      });
    });
  });
});

/**
 * VERIFY EMAIL CHANGE
 *
 * @route   api/users/verifyemailchange
 * @method  PATCH
 * @headers {
 *   'Content-Type': 'multipart/form-data'
 * }
 * @param {
 *   id:    {String}
 *   email: {String}
 * }
 */
router.patch('/verifyemailchange', (req, res, next) => {
  const {_id, email} = req.body;
  User.findOne({_id})
  .then(user => {
    if (!user) return next({message: 'User not found'});
    user.email = email;
    user.save()
    .then(user => res.json({
      success: true,
      message: 'Email successfully updated'
    }))
    .catch(err => next(err));
  });
});

/**
 * RESET PASSWORD
 *
 * @route   api/users/resetpassword
 * @method  POST
 * @headers {
 *   'Content-Type': 'application/json'
 * }
 * @body {
 *   email:              {String}
 * }
 */
router.post('/resetpassword', (req, res, next) => {
  const {email} = req.body;
  User.findOne({email}, (err, user) => {
    if (err) return next(err);
    sgMail.send(mailTemplate(req.body, user, 'resetPassword'));
    res.json({
      success: true,
      message: 'Password reset requested'
    });
  });
});

/**
 * VERIFY PASSWORD RESET
 *
 * @route   api/users/verifypasswordreset
 * @method  PATCH
 * @headers {
 *   'Content-Type': 'application/json'
 * }
 * @param {
 *   id:                 {String}
 *   newPassword:        {String}
 *   newPasswordConfirm: {String}
 *   secretQuestion:     {String}
 *   secretAnswer:       {String}
 * }
 */
router.patch('/verifypasswordreset', (req, res, next) => {
  const {_id, newPassword, newPasswordConfirm, secretQuestion, secretAnswer} = req.body;
  User.findById(_id, (err, user) => {
    if (!user) return next({message: 'User not found'});
    if (newPassword !== newPasswordConfirm) return next({message: 'New Password and New Password Confirm do not match'});
    if (
      secretQuestion !== user.secretQuestion ||
      secretAnswer !== user.secretAnswer
    ) return next({message: 'Secret Question and/or Answer is not valid'});
    const isPasswordValid = pwValidator(newPassword);
    if (isPasswordValid !== '') return next({message: isPasswordValid});
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        user.save()
        .then(() => res.json({
          success: true,
          message: 'Password successfully changed.'
        }))
        .catch(err => next(err));
      })
    });
  });
});

module.exports = router;
