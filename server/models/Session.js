/**
 * Session Model - MongoDB Schema
 * Predefine records for a collection
 *
 * @type {Schema|Mongoose}
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Session Schema
const SessionSchema = new Schema({
  _id: {
    type: mongoose.Schema.ObjectId
  },
  sessions: [{
    name: {
      type: String,
      minLength: [6, 'Name must be at least 6 characters long'],
      maxLength: [35, 'Name must be at most 35 characters long'],
      required: [true, 'Name is required'],
    },
    project: {
      type: String,
      required: [true, 'Password is required']
    },
    employer: {
      type: String,
      required: [true, 'Employer is required']
    },
    duration: {
      type: Number,
      required: [true, 'Session has no duration']
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Set the hourly rate first']
    },
    earned: {
      type: Number
    },
    date: {
      type: Date,
      default: Date.now()
    }
  }],
});

module.exports = Session = mongoose.model('sessions', SessionSchema);