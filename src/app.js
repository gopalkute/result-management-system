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

//routes import
import branchRouter from "./routes/branch.route.js";
import studentRouter from "./routes/student.route.js";
import hodRouter from "./routes/hod.route.js";
import resultRouter from "./routes/result.route.js";

//routes declaration
app.use("/api/v1/branches", branchRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/hods", hodRouter);
app.use("/api/v1/results", resultRouter);

export { app };
