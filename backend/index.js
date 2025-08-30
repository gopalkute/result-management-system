import connectDB from "./db/connection.js";
import dotenv from "dotenv";
import { app } from "./app.js";

//environment variables
dotenv.config({
   path: "./.env",
});

//connecting to db and starting server
connectDB()
   .then(() => {
      app.listen(process.env.PORT || 8000, () => {
         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
      });
   })
   .catch((err) => {
      console.log("MONGO db connection failed !!! ", err);
   });
