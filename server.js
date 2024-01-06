import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// route imports
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// dot env config
dotenv.config();

// database connection
connectDB();

// rest object
const app = express();

// middelwares
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// route
app.use("/api/v1", testRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Welcome To Node Server</h1>");
});

// port
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(
    `Server Running ${PORT} on ${process.env.NODE_ENV}`.bgMagenta.white
  );
});
