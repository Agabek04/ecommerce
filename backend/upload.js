const streamifier = require('streamifier');
const cloudinary = require('./cloud');

function uploadToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
  });
}

module.exports = uploadToCloudinary;
