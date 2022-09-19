export const INSERT_CORNER_PLOT = `INSERT INTO corner_plot VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

export const INSERT_PARAMETER_CONFIG_NO_PARAM_ID = `
INSERT INTO parameter_config
VALUE (?, (SELECT parameter_id
            FROM base_parameter
            WHERE file_id = ?
                AND parameter_name = ?), ?, ?, ?)
`;

export const INSERT_DATASET_CONFIG = `INSERT INTO dataset_config VALUES (?, ?, ?, ?, ?, ?, ?);`;

export const INSERT_DATASET_SIGMA = `INSERT INTO dataset_sigma VALUES (?, ?);`;

export const INSERT_DATASET_QUANTILE = `INSERT INTO dataset_quantile VALUES (?, ?);`;

export const GET_CORNER_PLOT_FROM_ID = `SELECT * FROM corner_plot WHERE corner_id = ?;`;

export const GET_PARAMETER_CONFIGS_FOR_PLOT = `SELECT bp.parameter_id AS parameter_id,
       parameter_name,
       file_id,
       domain_max,
       domain_min,
       label_text
FROM parameter_config pc
         JOIN base_parameter bp ON pc.parameter_id = bp.parameter_id
WHERE corner_id = ?;`;

export const GET_DATASET_CONFIGS_FOR_PLOT = `SELECT dataconf_id, file_id, bins, color, line_width, blur_radius
FROM dataset_config
WHERE corner_id = ?;`;

export const GET_SIGMAS_FOR_DATASET = `SELECT sigma_value
FROM dataset_sigma
WHERE dataconf_id = ?;`;

export const GET_QUANTILES_FOR_DATASET = `SELECT quantile_value
FROM dataset_quantile
WHERE dataconf_id = ?;`;

export const GET_BASE_PARAMETER_IDS = `
SELECT * FROM base_parameter WHERE file_id = ? AND parameter_name IN (?) 
`;
