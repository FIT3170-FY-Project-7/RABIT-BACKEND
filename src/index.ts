import { config as dotenv_config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { initializeApp } from 'firebase/app';

import { badRequestErrorHandler } from "./RestErrorResponse";
import UPLOAD_ROUTE from './Upload/UploadController';
import USER_ROUTE, { invalidCredentialsErrorHandler, invalidSignUpErrorHandler } from './User/UserController';

// Import env file
let envConfig = dotenv_config();
if (!envConfig.parsed) {
  console.error("Error: cannot find .env file.");
  console.error(envConfig.error.stack ?? "No stack trace available");
  process.exit(1);
}

// Initialise Firebase
const firebaseConfig =  {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const firebaseApp = initializeApp(firebaseConfig);

// Initialise express server
let app = express();
app.use(express.json());
const port = process.env.PORT;

app.use("/upload", UPLOAD_ROUTE);
app.use("/user", USER_ROUTE);

// Add error handlers
//app.use(invalidCredentialsErrorHandler);
app.use(invalidSignUpErrorHandler);
app.use(badRequestErrorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});
app.listen(port, () => {
  console.log(`⚡️[server]: Brand new Server is running at http://localhost:${port}`);
});
