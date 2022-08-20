import { v4 as uuidv4 } from "uuid";
import { SavePlotData } from "../PlotInterfaces/SavePlotData";
import { uploadPlotData } from "./PlotRepositories/SavePlots";

/**
 * Uploads parameters for re-generating a corner plot to the database
 * @param plotData Object containing all of the different configurations for the corner plot
 * @returns The uploaded corner plot's UUID in the database
 */
export const savePlotData = (plotData: SavePlotData): string => {

    // Insert the user's id and generate a new uuid for the corner plot
    const cornerId = uuidv4();

    // TODO: get user's id
    // const userId = getUserIdSomehow()
    plotData.corner_id = cornerId;
    // plotData.user_id = userId

    // Upload corner plot to database
    uploadPlotData(plotData)

    return cornerId;
};
