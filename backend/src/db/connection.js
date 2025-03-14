import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
   try {
      const connection = await mongoose.connect(
         `${process.env.DB_URI}/${DB_NAME}`
      );
      console.log(connection);
      console.log(`DB CONNECTION SUCCESSFUL !!`);
   } catch (error) {
      console.log(`DB CONNECTION ERROR : ${error}`);
      process.exit(1);
   }
};

export default connectDB;
