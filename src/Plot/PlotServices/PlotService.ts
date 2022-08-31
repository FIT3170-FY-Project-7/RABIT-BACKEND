import { v4 as uuidv4 } from "uuid";
import { SavePlotData } from "../PlotInterfaces/SavePlotData";
import { insertCornerPlotData } from "./PlotRepositories/SavePlots";
import { getCornerPlotData } from "./PlotRepositories/RetrievePlot";
import { FullCornerPlotData } from "../PlotInterfaces/GetPlotDataDTOs";
import { readRawDataFile } from "../../RawData/storageController";
import { filterPosteriorsFromDataset } from "../../RawData/RawDataServices/RawDataService";

/**
 * Uploads configuration details for a corner plot into the database, so that the corner plot can later
 * be re-generated for sharing purposes
 * @param plotData Object containing all of the different configurations for the corner plot, excluding the
 * corner plot's UUID and the UUIDs of each dataset the plot uses
 * @returns The saved corner plot's UUID in the database
 */
export const savePlotData = (plotData: SavePlotData): Promise<string> => {
  // Generate a new uuid for the corner plot
  const cornerId = uuidv4();
  plotData.corner_id = cornerId;

  // Generate a new uuid for each dataset configuration
  plotData.dataset_configs.forEach((dataset_config) => {
    dataset_config.dataconf_id = uuidv4();
  });

  // Upload corner plot to database
  return insertCornerPlotData(plotData);
};

/**
 * Retrieves configuration details and data for a previously uploaded corner plot
 * @param cornerId The UUID of the corner plot
 * @returns An object containing all the necessary configuration details for perfectly recreating the corner plot
 */
export const getPlotData = async (
  cornerId: string
): Promise<FullCornerPlotData> => {
  // Get the configuration data for the corner plot
  const cornerPlotData = await getCornerPlotData(cornerId);

  const plotParameterNames = cornerPlotData.parameter_configs.map(
    (parameter_config) => parameter_config.parameter_name
  );

  // Get the full raw data for each file
  await Promise.all(
    cornerPlotData.dataset_configs.map(async (dataset_config) => {
      // Get the raw data
      const rawData = await readRawDataFile(dataset_config.file_id);

      // Filter the data according to the corner plot's used parameters
      const filteredData = filterPosteriorsFromDataset(
        rawData,
        plotParameterNames
      );

      // Set the data in the data config
      dataset_config.data = filteredData;
    })
  );

  return cornerPlotData;
};
