import { config as dotenv_config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { initializeApp } from 'firebase/app';

import { sendBadRequest } from "./RestErrorResponse";
import UPLOAD_ROUTE from './Upload/UploadController';
import USER_ROUTE from './User/UserController';
import JWT_ROUTE from './Jwt/JwtController';
import { generateEd25519KeyPair } from "./Jwt/JwtService";

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

// Generate key pair for JWT
export const jwtKey = generateEd25519KeyPair();

// Initialise express server
let app = express();
app.use(express.json());
const port = process.env.PORT;

app.use("/jwt", JWT_ROUTE);
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
