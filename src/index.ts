import express, { Request, Response } from "express";
import { config as dotenv_config } from "dotenv";
import bodyParser from "body-parser";

import UPLOAD_ROUTE from "./Upload/UploadController";
import SHARE_ROUTE from "./Share/ShareController";

dotenv_config();

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT;

app.use("/upload", UPLOAD_ROUTE);
app.use("/share", SHARE_ROUTE);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server is running");
});

app.listen(port, () => {
    console.log(`⚡️[server]: Backend is running at http://localhost:${port}`);
});
