import express, { NextFunction, Request, Response } from "express";
import { config as dotenv_config} from "dotenv";
import { initializeApp, applicationDefault } from 'firebase-admin/app';

import UPLOAD_ROUTE from './Upload/UploadController';
import USER_ROUTE from './User/UserController';
import { BadRequestResponse, sendBadRequest } from "./RestErrorResponse";
import { addResponseHeaders } from "./Utils";

// Import env file
let envConfig = dotenv_config();
if (!envConfig.parsed) {
  console.error("Error: cannot find .env file.");
  console.error(envConfig.error.stack ?? "No stack trace available");
  process.exit(1);
}

// Initialise Firebase Admin
initializeApp({
  credential: applicationDefault(),
});


// Initialise express server
let app = express();
app.use(express.json());
const port = process.env.PORT;

app.use("/upload", UPLOAD_ROUTE);
app.use("/user", USER_ROUTE);

// Handle JSON parse error
// This needs to be handled in index because a SyntaxError is thrown before it reaches the controller code
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    return sendBadRequest(err.message, req, res);
  }
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});
app.listen(port, () => {
  console.log(`⚡️[server]: Brand new Server is running at http://localhost:${port}`);
});
