import express from "express";
// import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

import sequelizeDB from "./src/models";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const app = express();
const port: number = parseInt(process.env.PORT as string, 10) || 4001;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );

sequelizeDB.sync().then(() => {
  app.listen(port as number, () => {
    console.log(`Server running on port ${port}`);
  });
});
