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
SELECT p.collection_title, p.collection_id, MAX(c.last_modified) as last_modified from corner_plot c JOIN plot_collection p on p.collection_id = c.collection_id GROUP BY p.collection_id`;
