import express, { Request, Response } from "express";
import { config as dotenv_config } from "dotenv";
import UPLOAD_ROUTE from "./src/Upload/UploadController";

dotenv_config();

let app = express();
const port = process.env.PORT;

app.use("/upload", UPLOAD_ROUTE);

app.get("/raw-data/:rawDataID", (req: Request, res: Response) => {
	const rawDataID = req.params["rawDataID"];
	res.send(
		"A request to obtain raw data of ID " +
			rawDataID +
			" has been acknowledged"
	);
});

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server is running");
});

app.listen(port, () => {
	console.log(
		`⚡️[server]: Brand new Server is running at https://localhost:${port}`
	);
});
