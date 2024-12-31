const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: 'dqsokzave',
  api_key: '492147258758824',
  api_secret: 'CZSOue2Mi_BiqKXQGzA5lEMF8S4',
});

module.exports = cloudinary;
