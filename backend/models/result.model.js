import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
   {
      branch: {
         type: Schema.Types.ObjectId,
         ref: "Branch",
      },
      year: {
         type: Number,
         required: true,
      },
      sem: {
         type: Number,
         required: true,
      },
      prn: {
         type: Schema.Types.ObjectId,
         ref: "Student",
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
