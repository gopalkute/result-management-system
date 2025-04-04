import mongoose from "mongoose";

const connectDB = async () => {
   try {
      await mongoose.connect(
         `${process.env.DB_URI}/${process.env.DB_NAME}`
      );
      console.log(`DB CONNECTION SUCCESSFUL !!`);
   } catch (error) {
      console.log(`DB CONNECTION ERROR : ${error}`);
      process.exit(1);
   }
};

export default connectDB;
