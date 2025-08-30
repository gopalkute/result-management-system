import { body, param, check } from "express-validator";

const uploadResultValidation = [
   body("branch")
      .notEmpty()
      .withMessage("Branch is required")
      .isMongoId()
      .withMessage("Invalid branch ID"),

   body("year")
      .notEmpty()
      .withMessage("Year is required")
      .isNumeric()
      .withMessage("Year must be a number"),

   body("sem")
      .notEmpty()
      .withMessage("Semester is required")
      .isNumeric()
      .withMessage("Semester must be a number"),

   // File should be present
   check("file")
      .custom((value, { req }) => {
         if (!req.file) {
            throw new Error("File is required");
         }
         return true;
      })
      .withMessage("Excel file is required"),
];

const addResultValidation = [
   // const { prn, branch, year, sem, result } = req.body;

   body("prn")
      .notEmpty()
      .withMessage("PRN is required")
      .isMongoId()
      .withMessage("Invalid PRN ID"),

   body("branch")
      .notEmpty()
      .withMessage("Branch is required")
      .isMongoId()
      .withMessage("Invalid branch ID"),

   body("year")
      .notEmpty()
      .withMessage("Year is required")
      .isNumeric()
      .withMessage("Year must be a number"),

   body("sem")
      .notEmpty()
      .withMessage("Semester is required")
      .isNumeric()
      .withMessage("Semester must be a number"),

   // Validate result (should be an array of objects with subject and grade)
   body("result")
      .isArray({ min: 1 })
      .withMessage("Result must be a non-empty array")
      .custom((value) => {
         const seenSubjects = new Set();
         return value.every((item) => {
            if (
               typeof item.subject !== "string" ||
               typeof item.grade !== "string"
            ) {
               return false;
            }
            if (seenSubjects.has(item.subject)) {
               return false; // prevent duplicate subjects
            }
            seenSubjects.add(item.subject);
            return true;
         });
      })
      .withMessage(
         "Each result entry must contain a unique 'subject' and a 'grade', both as strings"
      ),
];

const IdValidation = [
   param("id").isMongoId().withMessage("id must be a mongoId"),
];

const updateResultValidation = [
   param("id").isMongoId().withMessage("id must be a mongoId"),

   // Validate result (should be an array of objects with subject and grade)
   body("result")
      .isArray({ min: 1 })
      .withMessage("Result must be a non-empty array")
      .custom((value) => {
         const seenSubjects = new Set();
         return value.every((item) => {
            if (
               typeof item.subject !== "string" ||
               typeof item.grade !== "string"
            ) {
               return false;
            }
            if (seenSubjects.has(item.subject)) {
               return false; // prevent duplicate subjects
            }
            seenSubjects.add(item.subject);
            return true;
         });
      })
      .withMessage(
         "Each result entry must contain a unique 'subject' and a 'grade', both as strings"
      ),
];

export {
   uploadResultValidation,
   IdValidation,
   addResultValidation,
   updateResultValidation,
};
