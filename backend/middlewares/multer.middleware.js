import multer from "multer";

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "public/");
   },
   filename: function (req, file, cb) {
      const fileName = `${Date.now()}-result.xlsx`;
      cb(null, fileName);
   },
});

const upload = multer({
   storage,
});

export { upload };
