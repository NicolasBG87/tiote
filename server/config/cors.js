/**
 * Cross Origin Resource Sharing config
 *
 * Set headers in such a way that only
 * app served from the specific host can access the server
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    }
    return next();
  });
};