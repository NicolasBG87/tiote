/**
 * User Model - MongoDB Schema
 * Predefine records for a collection
 *
 * @type {Schema|Mongoose}
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

// User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    minLength: [6, 'Name must be at least 6 characters long'],
    maxLength: [35, 'Name must be at most 35 characters long'],
    validate: {
      validator: value => /^([a-zA-Z]{2,}\s[a-zA-z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/.test(value),
      message: 'Name cannot contain numbers and special characters'
    },
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: value => validator.isEmail(value),
      message: 'Not a valid email'
    },
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  secretQuestion: {
    type: String,
    enum: [
      'Your first car',
      'Your first pet\'s name',
      'Your favorite song',
      'Your mother\'s middle name'
    ],
    required: [true, 'Secret Question is required']
  },
  secretAnswer: {
    type: String,
    required: [true, 'Secret Answer is required']
  },
  registerDate: {
    type: Date,
    default: Date.now()
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'rootAdmin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'placeholder'
  },
  localization: {
    type: String,
    enum: ['EN', 'SR', 'DE', 'ES', 'FR'],
    default: 'EN'
  },
  theme: {
    type: String,
    enum: ['Dark', 'Light', 'Aqua'],
    default: 'Dark'
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  allowExport: {
    type: Boolean,
    default: false
  },
  activitySession: {
    type: Number,
    min: [0, 'Session duration cannot be set below 0 minutes'],
    max: [120, 'Session duration cannot be set above 120 minutes'],
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  locked: {
    type: Boolean,
    default: false
  }
});

module.exports = User = mongoose.model('users', UserSchema);
