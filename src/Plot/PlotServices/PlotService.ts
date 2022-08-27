import { v4 as uuidv4 } from "uuid";
import { SavePlotData } from "../PlotInterfaces/SavePlotData";
import { insertCornerPlotData } from "./PlotRepositories/SavePlots";
import { getCornerPlotData } from "./PlotRepositories/RetrievePlot";
import { FullCornerPlotConfig } from "../PlotInterfaces/GetPlotDataDTOs";

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

export const getPlotData = (
  cornerId: string
): Promise<FullCornerPlotConfig> => {
  return getCornerPlotData(cornerId);
};
