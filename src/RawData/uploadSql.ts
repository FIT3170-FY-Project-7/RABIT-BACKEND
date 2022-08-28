export const INSERT_UPLOAD = `
INSERT INTO upload VALUES (?, ?, ?);
INSERT INTO plot_collection VALUES (?, ?);
`;

export const INSERT_FILE = `
INSERT INTO file_pointer VALUES (?, ?);
`;

export const GET_ALL_PLOT_COLLECTIONS = `
SELECT * FROM plot_collection
`;

export const GET_PLOT_COLLECTION = `
SELECT * FROM (plot_collection p JOIN file_pointer f on p.collection_id = f.collection_id) JOIN upload u ON f.upload_id = u.upload_id WHERE p.collection_id = ?
`;

export const GET_COLLECTIONS_FOR_USER = `
SELECT p.Collecetion_id, p.Collection_title, c.Last_modified FROM Plot_Collection p JOIN Corner_Plot c on p.Collection_id = c.Collection_id AND c.user_id = (SELECT TOP 1 cp.user_id FROM Corner_Plot cp WHERE cp.Collection_id = p.Collection_id AND cp.user_id = (?)) ORDERBY c.last_modified`;
