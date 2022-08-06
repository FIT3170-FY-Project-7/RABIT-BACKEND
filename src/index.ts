import express, { Request, Response } from "express";
import { config as dotenv_config} from "dotenv";
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import UPLOAD_ROUTE from './Upload/UploadController';

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
const port = process.env.PORT;

app.use("/upload", UPLOAD_ROUTE);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});
app.listen(port, () => {
  console.log(`⚡️[server]: Brand new Server is running at https://localhost:${port}`);
});
