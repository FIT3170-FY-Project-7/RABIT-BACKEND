import express, { Request, Response } from "express";
import { config as dotenv_config} from "dotenv";
import { initializeApp, applicationDefault } from 'firebase-admin/app';

import UPLOAD_ROUTE from './Upload/UploadController';

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
const port = process.env.PORT;

app.use("/upload", UPLOAD_ROUTE);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});
app.listen(port, () => {
  console.log(`⚡️[server]: Brand new Server is running at https://localhost:${port}`);
});
