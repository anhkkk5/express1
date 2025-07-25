const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
//end Cloudinary
module.exports.uploadtCloud = async function (req, res, next) {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    try {
      let result = await streamUpload(req);
      console.log("Cloudinary URL:", result.secure_url);

      req.body[req.file.fieldname] = result.secure_url;
      next(); // Chỉ gọi sau khi upload xong
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).send("Lỗi upload ảnh");
    }
  } else {
    next();
  }
};
