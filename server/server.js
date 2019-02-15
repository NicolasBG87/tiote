// Import packages from node_modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cloudinary = require('cloudinary');

const errorHandler = require('./helpers/error-handler');

// Import routes
const users = require('./routes/users');
const sessions = require('./routes/sessions');

// Define the server
const app = express();

// Use body-parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Define MongoDB key variable
const db = require('./config/keys').mongoURI;

// Connect with MongoDB
mongoose.set('useCreateIndex', true);
mongoose.set('runValidators', true);
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const cloudCfg = require('./config/keys').cloudinary;
cloudinary.config(cloudCfg);

// Use and configure passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Use Cross Origin Resource Sharing configuration
require('./config/cors')(app);

// Subscribe to users routes
app.use('/api/users', users);

// Subscribe to sessions routes
app.use('/api/sessions', sessions);

// Handle errors
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

// Declare the port
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));