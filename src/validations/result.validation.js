import { body, param } from "express-validator";

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
];

const getResultsByPRNValidation = [
   param("prn").isString().withMessage("PRN must be a string"),
];

const updateResultValidation = [
   // Validate PRN (should be a valid string or number that follows a specific pattern)
   param("prn")
      .notEmpty()
      .withMessage("PRN is required")
      .isString()
      .withMessage("PRN must be a string"),

   // Validate year (should be a number, e.g., 2023)
   body("year")
      .notEmpty()
      .withMessage("Year is required")
      .isInt({ min: 1 })
      .withMessage("Year must be a positive integer"),

   // Validate semester (should be a number, e.g., 1 or 2)
   body("sem")
      .notEmpty()
      .withMessage("Semester is required")
      .isInt({ min: 1, max: 8 })
      .withMessage("Semester must within 1 to 8"),

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

const validateDeleteResult = [
   param("prn")
      .isString()
      .withMessage("PRN must be a string")
      .notEmpty()
      .withMessage("PRN is required"),

   body("year")
      .isInt({ min: 1, max: 4 })
      .withMessage("Year must be a number between 1 and 4"),

   body("sem")
      .isInt({ min: 1, max: 8 })
      .withMessage("Semester must be a number between 1 and 8"),
];

export {
   uploadResultValidation,
   getResultsByPRNValidation,
   updateResultValidation,
   validateDeleteResult,
};
