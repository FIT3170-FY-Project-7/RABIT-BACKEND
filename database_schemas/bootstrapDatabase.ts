import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "node:util";

const execPromise = promisify(exec);

const startDatabase = async () => {
  console.log("Starting local database");
  dotenv.config();

  const envVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  if (envVars.some((envVar) => !process.env[envVar])) {
    console.error(
      `Please configure the database by specifying the environment variables ${envVars.join(
        ", "
      )}`
    );
  }

  return execPromise(
    `docker run --name rabit-dev-database -p 3306:3306 -e MYSQL_ROOT_PASSWORD=${process.env.DB_PASSWORD} -e MYSQL_DATABASE=${process.env.DB_NAME} -e MYSQL_USER=${process.env.DB_USER} -e MYSQL_PASSWORD=${process.env.DB_PASSWORD} -d mysql:latest`
  );
};

const connectToDatabase = async () => {
  console.log("Connecting to local database");

  // TODO: Ping DB
  console.log("Failed to connect, waiting and trying again later");
  await new Promise((resolve) => setTimeout(resolve, 20000));

  return mysql.createPool({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

const executeSQL = async (databasePool: Pool) => {
  const sqlFiles = ["DB_generation_schema", "create_temp_user"];

  for (const file of sqlFiles) {
    console.log(`Executing script ${file}`);
    const data = fs.readFileSync(`${__dirname}//${file}.sql`, "utf8");
    await databasePool.query(data);
  }
};

const main = async () => {
  await startDatabase();
  const pool = await connectToDatabase();
  await executeSQL(pool);
  pool.end();
  console.log("Finished");
};

main();
