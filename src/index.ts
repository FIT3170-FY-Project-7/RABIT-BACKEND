import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./router";
import cors from "cors";

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(router);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
