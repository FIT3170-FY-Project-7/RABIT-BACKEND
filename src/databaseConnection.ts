import mysql, { RowDataPacket } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const envVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
if (envVars.some((envVar) => !process.env[envVar])) {
    console.error(
        `Please configure the database by specifying the environment variables ${envVars.join(
            ", "
        )}`
    );
}

const databasePool = mysql
    .createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })
    .promise();

export const toDBDate = (date: Date) => date.toISOString().split("T")[0];

export interface PlotCollection extends RowDataPacket {
    collection_id: string;
    collection_title: string;
    collection_description: string;
}

export interface FilePointer extends RowDataPacket {
    upload_id: string;
    collection_id: string;
}

export interface Upload extends RowDataPacket {
    upload_id: string;
    user_id: string;
    upload_datetime: Date;
}

export default databasePool;
