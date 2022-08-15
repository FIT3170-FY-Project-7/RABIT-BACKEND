import fs from "fs";
import dotenv from "dotenv";
import path from "node:path";

if (!process.env.DATA_PATH) {
  dotenv.config();
}
if (process.env.DATA_PATH) {
  console.log("Storage controller configured at", process.env.DATA_PATH);
  fs.mkdir(process.env.DATA_PATH, { recursive: true }, (err) => {
    if (err) throw err;
  });
} else {
  console.error("DATA_PATH environment variable is not set");
}

export const saveFile = (filename: string, content: string): void => {
  const filepath = path.join(process.env.DATA_PATH, filename);

  try {
    fs.writeFileSync(filepath, Buffer.from(content, "base64"));
    console.log("Saved file", filepath);
  } catch (err) {
    console.error("Failed to write file", err);
  }
};

export const readFile = (filename: string): string | undefined => {
  const filepath = path.join(process.env.DATA_PATH, filename);

  try {
    return fs.readFileSync(filepath, { encoding: "utf8" });
  } catch (err) {
    console.error("Failed to write file", err);
  }
};
