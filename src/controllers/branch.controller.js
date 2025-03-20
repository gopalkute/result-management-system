import { asyncHandler } from "../utils/asyncHandler.js";

const getBranches = asyncHandler((req, res) => {
   res.send("get branches route work");
});

const getBranchById = asyncHandler((req, res) => {
   res.send(`get branche by id route work ${req.params.id}`);
});

const createBranch = asyncHandler((req, res) => {
   const { name, id } = req.body;

   res.send(`create branches route work ${name} and ${id}`);
});

const updateBranch = asyncHandler((req, res) => {
   const { name } = req.body;

   res.send(
      `update branches route work id = ${req.params.id} and name = ${name}`
   );
});

const deleteBranch = asyncHandler((req, res) => {
   res.send("delete branches route work");
});

export { getBranches, getBranchById, createBranch, updateBranch, deleteBranch };
