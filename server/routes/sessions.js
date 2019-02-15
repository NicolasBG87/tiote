/**
 * Sessions routes
 *
 * Handle all routes connected with sessions
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
const jwt = require('jsonwebtoken');
const keys = require('../config/keys.dev');
const tokenFormatter = require('../helpers/token-formatter');
const Session = require('../models/Session');
const sessionFilter = require('../helpers/session-filter');

/**
 * GET SESSIONS
 *
 * @route   api/sessions/get
 * @method  GET
 * @headers {
 *   'Content-Type': 'application/json'
 *   'Authorization': '<access_token>'
 * }
 * @body {
 *   _id:    {String}
 *   params: {
 *     date: {Date}
 *     type: {String}
 *   }
 * }
 */
router.get('/get', (req, res, next) => {
  const token = tokenFormatter(req.headers.authorization);
  const { _id, params } = req.body;
  jwt.verify(token, keys.jwtKey, (err) => {
    if (err) return next({ message: 'You are not authorized' });
    Session.findById(_id, (err, session) => {
      if (err) return next(err);
      let sessions = session.toObject().sessions;
      let data = sessionFilter(sessions, params);
      res.json({
        success: true,
        data: data
      });
    });
  });
});

/**
 * ADD SESSION
 *
 * @route   api/sessions/add
 * @method  PUT
 * @headers {
 *   'Content-Type': 'application/json'
 *   'Authorization': '<access_token>'
 * }
 * @body {
 *   _id:        {String}
 *   session: {
 *     name:       {String}
 *     project:    {String}
 *     employer:   {String}
 *     duration:   {Number}
 *     hourlyRate: {Number}
 *     earned:     {Number}
 *     date:       {Date}
 *   }
 * }
 */
router.put('/add', (req, res, next) => {
  const token = tokenFormatter(req.headers.authorization);
  const { _id, session } = req.body;
  jwt.verify(token, keys.jwtKey, (err) => {
    if (err) return next({ message: 'You are not authorized' });
    Session.findById(_id, (err, serverData) => {
      if (err) return next(err);
      let sessions = serverData.sessions;
      sessions.push(session);
      serverData.save()
      .then(() => {
        res.json({
          success: true,
          data: session
        });
      })
      .catch(err => next(err));
    });
  });
});

/**
 * UPDATE SESSION
 *
 * @route   api/sessions/update
 * @method  PUT
 * @headers {
 *   'Content-Type': 'application/json'
 *   'Authorization': '<access_token>'
 * }
 * @body {
 *   _id:        {String}
 *   session: {
 *     _id:        {String}
 *     name:       {String}
 *     project:    {String}
 *     employer:   {String}
 *   }
 * }
 */
router.patch('/update', (req, res, next) => {
  const token = tokenFormatter(req.headers.authorization);
  const { _id, session } = req.body;
  const { name, project, employer } = session;
  jwt.verify(token, keys.jwtKey, (err) => {
    if (err) return next({ message: 'You are not authorized' });
    Session.updateOne(
      { _id, sessions: { $elemMatch: { _id: session._id }} },
      { $set: {
        "sessions.$.name" : name,
        "sessions.$.project" : project,
        "sessions.$.employer" : employer,
      }},
      err => {
        if (err) return next(err);
        res.json({
          success: true,
          message: 'Session record successfully updated'
        });
      }
    );
  });
});

module.exports = router;
