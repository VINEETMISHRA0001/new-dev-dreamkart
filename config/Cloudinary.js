const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dqsokzave',
  api_key: '649568283412352',
  api_secret: 'WHW-X9SrGWi1snec2MJenPaDa2o',
  secure: true,
});

if (
  !cloudinary.config().cloud_name ||
  !cloudinary.config().api_key ||
  !cloudinary.config().api_secret
) {
  console.error('Cloudinary config not set up');
  return; // End script upon error
}

// Log the config to ensure it's properly set
console.log(cloudinary.config());

module.exports = cloudinary;
