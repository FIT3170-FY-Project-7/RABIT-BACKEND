import {
  CornerPlotRow,
  ParameterConfigRow,
  DatasetConfigRow,
  DatasetQuantileRow,
  DatasetSigmaRow,
  FullCornerPlotData,
  CornerPlotParsed,
  DatasetConfigParsed,
  ParameterConfigParsed
} from "../../PlotInterfaces/GetPlotDataDTOs";
import {
  GET_CORNER_PLOT_FROM_ID,
  GET_PARAMETER_CONFIGS_FOR_PLOT,
  GET_DATASET_CONFIGS_FOR_PLOT,
  GET_SIGMAS_FOR_DATASET,
  GET_QUANTILES_FOR_DATASET
} from "./PlotQuerySQL";
import databaseConnection from "../../../databaseConnection";
import {
  parseCornerPlotRow,
  parseParameterConfigRows,
  parseDatasetConfigRows
} from "./DBOutputParsers";

/**
 * Queries the database to get the corner plot's metadata and plot configuration
 * @param corner_id The UUID of the corner plot
 * @returns A promise that resolves to the corner plot's metadata and configuration
 */
const getCornerPlotConfig = async (
  corner_id: string
): Promise<CornerPlotParsed> => {
  const [corner_plot] = await databaseConnection.query<CornerPlotRow[]>(
    GET_CORNER_PLOT_FROM_ID,
    [corner_id]
  );

  return parseCornerPlotRow(corner_plot[0]);
};

/**
 * Queries the database to get parameter configurations
 * @param corner_id The UUID of the associated corner plot
 * @returns A promise that resolves to the parameter configurations
 */
const getParameterConfigs = async (
  corner_id: string
): Promise<ParameterConfigParsed[]> => {
  const [parameter_configs] = await databaseConnection.query<
    ParameterConfigRow[]
  >(GET_PARAMETER_CONFIGS_FOR_PLOT, [corner_id]);

  return parseParameterConfigRows(parameter_configs);
};

/**
 * Queries the database to get dataset sigmas
 * @param dataconf_id The UUID of the associated dataset configuration
 * @returns A promise that resolves to an array of sigmas
 */
const getDatasetSigmas = async (dataconf_id: string): Promise<number[]> => {
  const [dataset_sigmas] = await databaseConnection.query<DatasetSigmaRow[]>(
    GET_SIGMAS_FOR_DATASET,
    [dataconf_id]
  );

  // Map the output of the query to an array of numbers
  return dataset_sigmas.map((dataset_sigma) => +dataset_sigma.sigma_value);
};

/**
 * Queries the database to get dataset quantiles
 * @param dataconf_id The UUID of the associated dataset configuration
 * @returns A promise that resolves to an array of quantiles
 */
const getDatasetQuantiles = async (dataconf_id: string): Promise<number[]> => {
  const [dataset_quantiles] = await databaseConnection.query<
    DatasetQuantileRow[]
  >(GET_QUANTILES_FOR_DATASET, [dataconf_id]);

  // Map the output of the query to an array of numbers
  return dataset_quantiles.map(
    (dataset_quantile) => +dataset_quantile.quantile_value
  );
};

/**
 * Queries the database to get dataset configurations
 * @param corner_id The UUID of the associated corner plot
 * @returns A promise that resolves to the dataset configurations, including sigmas and quanatiles
 */
const getDatasetConfigs = async (
  corner_id: string
): Promise<DatasetConfigParsed[]> => {
  const [dataset_configs] = await databaseConnection.query<DatasetConfigRow[]>(
    GET_DATASET_CONFIGS_FOR_PLOT,
    [corner_id]
  );

  // Get the sigmas and quantiles for each dataset
  await Promise.all(
    dataset_configs.map(async (dataset_config) => {
      dataset_config.sigmas = await getDatasetSigmas(
        dataset_config.dataconf_id
      );

      dataset_config.quantiles = await getDatasetQuantiles(
        dataset_config.dataconf_id
      );
    })
  );

  return parseDatasetConfigRows(dataset_configs);
};

/**
 * Retrieves a corner plot's configuration data from the database
 * @param corner_id The UUID of the corner plot
 * @returns An object containing all of the corner plot's configuration details
 */
export const getCornerPlotData = async (
  corner_id: string
): Promise<FullCornerPlotData> => {
  // Perform database queries to retrieve the relevant data from each table
  const cornerPlotConfig = await getCornerPlotConfig(corner_id);
  const parameterConfigs = await getParameterConfigs(corner_id);
  const datasetConfigs = await getDatasetConfigs(corner_id);

  // Contstruct the complete output and return it
  return {
    ...cornerPlotConfig,
    dataset_configs: datasetConfigs,
    parameter_configs: parameterConfigs
  };
};
