const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'daanhgra0',
  api_key: '258729341427661',
  api_secret: 'GoOmXRmd6eYqmCrkZZVnl0OayrA'
});

module.exports = cloudinary;
