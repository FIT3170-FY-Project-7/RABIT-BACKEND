import {
  CornerPlotRow,
  ParameterConfigRow,
  DatasetConfigRow,
  DatasetQuantileRow,
  DatasetSigmaRow,
  FullCornerPlotConfig
} from "../../PlotInterfaces/GetPlotDataDTOs";
import {
  GET_CORNER_PLOT_FROM_ID,
  GET_PARAMETER_CONFIGS_FOR_PLOT,
  GET_DATASET_CONFIGS_FOR_PLOT,
  GET_SIGMAS_FOR_DATASET,
  GET_QUANTILES_FOR_DATASET
} from "./PlotQuerySQL";
import databaseConnection from "../../../databaseConnection";

/**
 * Queries the database to get the corner plot's metadata and plot configuration
 * @param corner_id The UUID of the corner plot
 * @returns A promise that resolves to the corner plot's metadata and configuration
 */
const getCornerPlotConfig = async (
  corner_id: string
): Promise<CornerPlotRow> => {
  const [corner_plot] = await databaseConnection.query<CornerPlotRow[]>(
    GET_CORNER_PLOT_FROM_ID,
    [corner_id]
  );

  return corner_plot[0];
};

/**
 * Queries the database to get parameter configurations
 * @param corner_id The UUID of the associated corner plot
 * @returns A promise that resolves to the parameter configurations
 */
const getParameterConfigs = async (
  corner_id: string
): Promise<ParameterConfigRow[]> => {
  const [parameter_configs] = await databaseConnection.query<
    ParameterConfigRow[]
  >(GET_PARAMETER_CONFIGS_FOR_PLOT, [corner_id]);

  return parameter_configs;
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
  return dataset_sigmas.map((dataset_sigma) => dataset_sigma.sigma_value);
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
    (dataset_quantile) => dataset_quantile.quantile_value
  );
};

/**
 * Queries the database to get dataset configurations
 * @param corner_id The UUID of the associated corner plot
 * @returns A promise that resolves to the dataset configurations, including sigmas and quanatiles
 */
const getDatasetConfigs = async (
  corner_id: string
): Promise<DatasetConfigRow[]> => {
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

  return dataset_configs;
};

/**
 * Combines information retrieved from select queries into a single object. The process involves
 * some restructuring of the data
 * @param cornerPlotConfig Configuration data from the `corner_plot` table
 * @param parameterConfigs Configuration data from the `parameter_config` table
 * @param datasetConfigs Configuration data from the `dataset_config`, `dataset_sigma`, and `dataset_quantile`
 * tables
 * @returns A single object that combines all of the information from the database, formatted for the frontend to
 * use
 */
const constructOutputObject = (
  cornerPlotConfig: CornerPlotRow,
  parameterConfigs: ParameterConfigRow[],
  datasetConfigs: DatasetConfigRow[]
): FullCornerPlotConfig => {
  const fullPlotData: FullCornerPlotConfig = {
    corner_id: cornerPlotConfig.corner_id,
    last_modified: cornerPlotConfig.last_modified,
    date_created: cornerPlotConfig.date_created,
    collection_id: cornerPlotConfig.collection_id,
    user_id: cornerPlotConfig.collection_id,
    plot_config: {
      plot_size: cornerPlotConfig.plot_size,
      subplot_size: cornerPlotConfig.subplot_size,
      margin: {
        horizontal: cornerPlotConfig.margin_horizontal,
        vertical: cornerPlotConfig.margin_vertical
      },
      axis: {
        size: cornerPlotConfig.axis_size,
        tick_size: cornerPlotConfig.axis_ticksize,
        ticks: cornerPlotConfig.axis_ticks
      },
      background_color: cornerPlotConfig.background_color
    },
    dataset_configs: datasetConfigs.map((datasetConfig) => {
      return {
        dataconf_id: datasetConfig.dataconf_id,
        file_id: datasetConfig.file_id,
        bins: datasetConfig.bins,
        color: datasetConfig.color,
        line_width: datasetConfig.line_width,
        blur_radius: datasetConfig.blur_radius,
        quantiles: datasetConfig.quantiles,
        sigmas: datasetConfig.sigmas
      };
    }),
    parameter_configs: parameterConfigs.map((parameterConfig) => {
      return {
        parameter_id: parameterConfig.parameter_id,
        parameter_name: parameterConfig.parameter_name,
        file_id: parameterConfig.file_id,
        domain: [parameterConfig.domain_min, parameterConfig.domain_max]
      };
    })
  };

  return fullPlotData;
};

/**
 * Retrieves a corner plot's configuration data from the database
 * @param corner_id The UUID of the corner plot
 * @returns An object containing all of the corner plot's configuration details
 */
export const getCornerPlotData = async (
  corner_id: string
): Promise<FullCornerPlotConfig> => {
  // Perform database queries to retrieve the relevant data from each table
  const cornerPlotConfig = await getCornerPlotConfig(corner_id);
  const parameterConfigs = await getParameterConfigs(corner_id);
  const datasetConfigs = await getDatasetConfigs(corner_id);

  // Contstruct the complete output and return it
  return constructOutputObject(
    cornerPlotConfig,
    parameterConfigs,
    datasetConfigs
  );
};
