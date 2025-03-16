import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
   {
      prn: {
         type: String,
         required: true,
         unique: true,
         index: true,
         trim: true,
      },
      year: {
         type: Number,
         required: true,
      },
      sem: {
         type: Number,
         required: true,
      },
      result: [
         {
            subject: {
               type: String,
               required: true,
            },
            grade: {
               type: String,
               required: true,
            },
         },
      ],
   },
   {
      timestamps: true,
   }
);

export const Result = mongoose.model("Result", resultSchema);
