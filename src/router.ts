import { Router, Request, Response } from "express";
import databaseConnection, {
	toDBDate,
	PlotCollection,
	FilePointer,
	Upload,
} from "./databaseConnection";
import { v4 as uuidv4 } from "uuid";
import uploadController from "./Upload/UploadController";
import { readFile, saveFile } from "./storageController";

// Until accounts are added, all data with be under this user
const TEMP_USER = "temp";

const router = Router();
router.use("/upload", uploadController);

router.post("/raw-data", async (req: Request, res: Response) => {
	const uploadId = uuidv4();
	const collectionId = uuidv4();

	if (!req.body.file || !req.body.name) {
		res.status(400).send({ message: "Missing file or name parameters" });
		return;
	}

	saveFile(uploadId, req.body.file);
	databaseConnection.query(
		`INSERT INTO upload VALUES (?, ?, ?); 
    INSERT INTO plot_collection VALUES (?, ?);
    INSERT INTO file_pointer VALUES (?, ?);
    `,
		[
			uploadId,
			TEMP_USER,
			toDBDate(new Date()),
			collectionId,
			req.body.name,
			uploadId,
			collectionId,
		],
		(err) => {
			if (err) {
				const message = "Failed to insert into database";
				console.error(message, err);
				res.status(500).send({ message });
			} else {
				res.send({ id: collectionId });
			}
		}
	);
});

router.get("/raw-data/", async (req: Request, res: Response) => {
	databaseConnection.query(
		`SELECT * FROM plot_collection`,
		(err, rawDataList, fields) => {
			if (err) {
				const message = "Failed to fetch from database";
				console.error(message, err);
				res.status(500).send({ message });
			} else {
				res.send(rawDataList);
			}
		}
	);
});

router.get("/raw-data/:id", async (req: Request, res: Response) => {
	databaseConnection.query<(PlotCollection | FilePointer | Upload)[]>(
		`SELECT * FROM (plot_collection p JOIN file_pointer f on p.collection_id = f.collection_id) JOIN upload u ON f.upload_id = u.upload_id WHERE p.collection_id = ?;`,
		[req.params.id],
		(err, rows) => {
			if (err) {
				const message = "Failed to fetch from database";
				console.error(message, err);
				res.status(500).send({ message });
			} else {
				if (rows?.length === 0) {
					res.status(404).send({
						message:
							"Plot collection with given id doesn't not exist",
					});
				}
				const row = rows[0];
				const data = readFile(row.upload_id);
				res.send({
					id: req.params.id,
					name: row.collection_name,
					data,
				});
			}
		}
	);
});

export default router;
