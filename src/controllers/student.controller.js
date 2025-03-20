import { asyncHandler } from "../utils/asyncHandler.js";

const getStudents = asyncHandler((req, res) => {
   res.send("students route working");
});

const getStudentByPRN = asyncHandler((req, res) => {
   res.send(`student prn ${req.params.prn} route working`);
});

const createStudent = asyncHandler((req, res) => {
   res.json(req.body);
});

const updateStudent = asyncHandler((req, res) => {
   console.log(req.params.prn);

   res.json(req.body);
});

const deleteStudent = asyncHandler((req, res) => {
   res.send(`${req.params.prn} is deleted`);
});

export {
   getStudents,
   getStudentByPRN,
   createStudent,
   updateStudent,
   deleteStudent,
};
