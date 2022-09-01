import { config as dotenv_config } from "dotenv";
import bodyParser from "body-parser";
import router from "./router";
import cors from "cors";
import initFirebase from "./Firebase";
import { badRequestErrorHandler } from "./ExpressErrorHandlers";
import express from "express";

// Import env file
let envConfig = dotenv_config();
if (!envConfig.parsed) {
  console.error("Error: cannot find .env file.");
  console.error(envConfig.error.stack ?? "No stack trace available");
  process.exit(1);
}

// Initialise Firebase
// initFirebase();

// Initialise express server
let app = express();
// FIXME: this might be able to be replaced with the express equivalent instead, since body-parser is deprecated
// https://github.com/expressjs/body-parser/commit/b7420f8dc5c8b17a277c9e50d72bbaf3086a3900
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(router);

// Add bad request error handler
// NOTE: This needs to be initialised here. Otherwise, express would just 'ignore' the handler and sends a html output
// instead
app.use(badRequestErrorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.info(`Backend is running at http://localhost:${port}`);
});
