export const INSERT_UPLOAD = `
INSERT INTO upload VALUES (?, ?, ?);
INSERT INTO plot_collection VALUES (?, ?, ?);
`;

export const INSERT_FILE = `
INSERT INTO file_pointer VALUES (?, ?, ?);
`;

export const GET_ALL_PLOT_COLLECTIONS = `
SELECT * FROM plot_collection
`;

export const GET_PLOT_COLLECTION = `
SELECT * FROM (plot_collection p JOIN file_pointer f on p.collection_id = f.collection_id) JOIN base_parameter b ON b.file_id = f.file_id WHERE p.collection_id = ?
`;

export const INSERT_BASE_PARAMETER = `
INSERT INTO base_parameter VALUES (?, ?, ?);
`;

export const GET_BASE_PARAMETER = `
SELECT * FROM base_parameter WHERE parameter_id = ?
`;
