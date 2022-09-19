import {
  SavePlotData,
  DatasetConfig,
  PlotParams
} from "../../PlotInterfaces/SavePlotData";
import {
  INSERT_CORNER_PLOT,
  INSERT_DATASET_CONFIG,
  INSERT_DATASET_QUANTILE,
  INSERT_DATASET_SIGMA,
  INSERT_PARAMETER_CONFIG_NO_PARAM_ID
} from "./PlotQuerySQL";
import databaseConnection from "../../../databaseConnection";

/**
 * Inserts data into the `corner_plot` table in the database
 * @param plotData A corner plot's configuration details
 */
const insertCornerPlot = async (plotData: SavePlotData): Promise<void> => {
  // Extract corner plot data
  const corner_id = plotData.corner_id;
  const last_modified = new Date();
  const date_created = plotData.date_created || last_modified;
  const collection_id = plotData.collection_id;
  const user_id = plotData.user_id;

  // Extract plot config data
  const plot_config = plotData.plot_config;
  const plot_size = plot_config.plot_size;
  const subplot_size = plot_config.subplot_size;
  const margin_horizontal = plot_config.margin.horizontal;
  const margin_vertical = plot_config.margin.vertical;
  const axis_size = plot_config.axis.size;
  const axis_tick_size = plot_config.axis.tickSize;
  const axis_ticks = plot_config.axis.ticks;
  const background_color = plot_config.background_color;

  await databaseConnection.query(INSERT_CORNER_PLOT, [
    corner_id,
    last_modified,
    last_modified,
    collection_id,
    user_id,
    plot_size,
    subplot_size,
    margin_horizontal,
    margin_vertical,
    axis_size,
    axis_tick_size,
    axis_ticks,
    background_color
  ]);
};

/**
 * Inserts the configuration details for all parameters of a given corner plot into the `parmeter_config`
 * table in the database
 * @param corner_id The UUID of the associated corner plot
 * @param parameterConfigs An array of configuration details for each parameter
 */
const insertParameterConfigs = async (
  corner_id: string,
  parameterConfigs: PlotParams[]
): Promise<void> => {
  await Promise.all(
    parameterConfigs.map(async (parameterConfig) => {
      const name = parameterConfig.name;
      const file_id = parameterConfig.file_id;
      const domain_min = parameterConfig.domain[0].toString();
      const domain_max = parameterConfig.domain[1].toString();

      // TODO: update the label text here with the real values
      const label_text = "sample label text";

      await databaseConnection.query(INSERT_PARAMETER_CONFIG_NO_PARAM_ID, [
        corner_id,
        file_id,
        name,
        domain_max,
        domain_min,
        label_text
      ]);
    })
  );
};

/**
 * Inserts the configuration details for all datasets used in a given corner plot into the
 * `dataset_config`, `dataset_sigma`, and `dataset_quantile` tables in the database
 * @param corner_id The UUID of the associated corner plot
 * @param datasetConfigs An array of configuration details for each dataset
 */
const insertDatasetConfigs = async (
  corner_id: string,
  datasetConfigs: DatasetConfig[]
): Promise<void> => {
  await Promise.all(
    datasetConfigs.map(async (datasetConfig) => {
      const dataconf_id = datasetConfig.dataconf_id;
      const file_id = datasetConfig.file_id;
      const bins = datasetConfig.bins;
      const color = datasetConfig.color;
      const line_width = datasetConfig.line_width;
      const blur_radius = datasetConfig.blur_radius;

      await databaseConnection.query(INSERT_DATASET_CONFIG, [
        dataconf_id,
        corner_id,
        file_id,
        bins,
        color,
        line_width,
        blur_radius
      ]);

      await insertDatasetSigmas(dataconf_id, datasetConfig.sigmas);
      await insertDatasetQuantiles(dataconf_id, datasetConfig.quantiles);
    })
  );
};

/**
 * Inserts the sigma values of a dataset configuration into the `dataset_sigma` table
 * @param dataconf_id The UUID of the associated dataset configuration
 * @param sigmas An array of sigma values to be inserted
 */
const insertDatasetSigmas = async (
  dataconf_id: string,
  sigmas: number[]
): Promise<void> => {
  await Promise.all(
    sigmas.map(async (sigma) => {
      await databaseConnection.query(INSERT_DATASET_SIGMA, [
        dataconf_id,
        sigma
      ]);
    })
  );
};

/**
 * Inserts the quantile values of a dataset configuration into the `dataset_quantile` table
 * @param dataconf_id The UUID of the associated dataset configuration
 * @param quantiles An array of quantile values to be inserted
 */
const insertDatasetQuantiles = async (
  dataconf_id: string,
  quantiles: number[]
): Promise<void> => {
  await Promise.all(
    quantiles.map(async (quantile) => {
      await databaseConnection.query(INSERT_DATASET_QUANTILE, [
        dataconf_id,
        quantile
      ]);
    })
  );
};

/**
 * Inserts a completed corner plot's configuration details into the database
 * @param plotData A corner plot's configuration details
 * @returns A promise that resolves to the corner plot's UUID
 */
export const insertCornerPlotData = async (
  plotData: SavePlotData
): Promise<string> => {
  const corner_id = plotData.corner_id;

  await insertCornerPlot(plotData);
  await insertParameterConfigs(corner_id, plotData.parameters);
  await insertDatasetConfigs(corner_id, plotData.dataset_configs);

  return corner_id;
};
