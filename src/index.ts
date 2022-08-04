import express, { Request, Response } from "express";
import { config as dotenv_config} from "dotenv";
import UPLOAD_ROUTE from './Upload/UploadController';

dotenv_config();

let app = express();
const port = process.env.PORT;

app.use("/upload", UPLOAD_ROUTE);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});
app.listen(port, () => {
  console.log(`⚡️[server]: Brand new Server is running at https://localhost:${port}`);
});
