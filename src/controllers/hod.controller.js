import { asyncHandler } from "../utils/asyncHandler.js";

const getHODs = asyncHandler((req, res) => {
   res.send("hod route working");
});

const getHODById = asyncHandler((req, res) => {
   res.send(`hod uid ${req.params.uid} route working`);
});

const createHOD = asyncHandler((req, res) => {
   res.json(req.body);
});

const updateHOD = asyncHandler((req, res) => {
   console.log(req.params.uid);

   res.json(req.body);
});

const deleteHOD = asyncHandler((req, res) => {
   res.send(`${req.params.uid} is deleted`);
});



export { getHODs, getHODById, createHOD, updateHOD, deleteHOD };
