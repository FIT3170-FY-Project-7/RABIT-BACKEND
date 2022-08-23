import {config as dotenv_config} from "dotenv";
import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import router from "./router";
import initFirebase from "./Firebase";

// Import env file
let envConfig = dotenv_config();
if (!envConfig.parsed) {
  console.error("Error: cannot find .env file.");
  console.error(envConfig.error.stack ?? "No stack trace available");
  process.exit(1);
}

// Initialise Firebase
initFirebase();

// Initialise express server
let app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

const port = process.env.PORT;


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});
app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
