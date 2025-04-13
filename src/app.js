import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

app.use(
   cors({
      origin: process.env.CORS_ORIGIN,
   })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import hodRouter from "./routes/hod.route.js";
import studentRouter from "./routes/student.route.js";

//routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/hod", hodRouter);
app.use("/api/v1/student", studentRouter);
export { app };
