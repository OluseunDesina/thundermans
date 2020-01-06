const multer = require("multer");


// configuring Multer
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid Mime Type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    // console.log(file.filename);
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${extension}`)
  }
})

module.exports = multer({storage}).single('image');
