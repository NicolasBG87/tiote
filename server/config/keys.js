/**
 * Production environment keys
 *
 * @type {{mongoURI: string, jwtKey: string}}
 */
module.exports = {
  mongoURI: process.env.MONGODB_URI,
  jwtKey: process.env.JWT_KEY,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  },
  sendGrid: process.env.SENDGRID_API_KEY
};
