import multer from "multer";

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "src/public/temp/");
   },
   filename: function (req, file, cb) {
      const fileName = `${Date.now()}-result.xlsx`;
      cb(null, fileName);
   },
});

export const upload = multer({ 
   storage, 
})