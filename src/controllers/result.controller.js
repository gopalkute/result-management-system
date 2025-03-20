import { asyncHandler } from "../utils/asyncHandler.js";

const getResults = asyncHandler((req, res) => {
   res.send("results route working");
});

const getResultByPRN = asyncHandler((req, res) => {
   res.send(`student prn ${req.params.prn}  for result route working`);
});

const createResult = asyncHandler((req, res) => {
   res.send(`file successfully uploaded and result is saved `);
});

const updateResult = asyncHandler((req, res) => {
   console.log(req.params.prn);

   res.json(req.body);
});

const deleteResult = asyncHandler((req, res) => {
   res.send(` result of ${req.params.prn} is deleted`);
});

export { getResults, getResultByPRN, createResult, updateResult, deleteResult };
