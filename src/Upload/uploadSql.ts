export const INSERT_UPLOAD = `
INSERT INTO upload VALUES (?, ?, ?);
INSERT INTO plot_collection VALUES (?, ?);
`;

export const INSERT_FILE = `
INSERT INTO file_pointer VALUES (?, ?);
`;
