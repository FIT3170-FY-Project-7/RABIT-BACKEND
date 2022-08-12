import mysql, { RowDataPacket } from "mysql2";
import dotenv from "dotenv";

if (!process.env.DB_HOST) {
	dotenv.config();
}

// Not using top-level async to avoid having to change configuration
const databaseConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	multipleStatements: true,
});

export const toDBDate = (date: Date) => date.toISOString().split("T")[0];

export interface PlotCollection extends RowDataPacket {
	collection_id: string;
	collection_name: string;
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

export default databaseConnection;
