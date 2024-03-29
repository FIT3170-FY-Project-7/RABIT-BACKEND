// This will patch express to catch async errors
import express from "express";
import "express-async-errors";

import bodyParser from "body-parser";
import cors from "cors";
import { config as dotenv_config } from "dotenv";
import { badRequestErrorHandler } from "./ExpressErrorHandlers";
import initFirebase from "./Firebase";
import router from "./router";

// Import env file
let envConfig = dotenv_config();
if (!envConfig.parsed) {
  console.error("Error: cannot find .env file.");
  console.error(envConfig.error.stack ?? "No stack trace available");
  process.exit(1);
}

// Initialise Firebase
// NOTE: RABIT does not currently have a proper authentication system. If you want to use firebase
// functionality, set up firebase as per firebase page on the docs.
if (process.env.USE_FIREBASE == "1") {
  initFirebase();
}

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

// Disable http header that reveals this is express.
// more info: https://www.troyhunt.com/shhh-dont-let-your-response-headers/
app.disable('x-powered-by');

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
