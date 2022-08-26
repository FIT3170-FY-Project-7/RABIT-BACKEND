import { v4 as uuidv4 } from "uuid";
import { SavePlotData } from "../PlotInterfaces/SavePlotData";
import { insertPlotData } from "./PlotRepositories/SavePlots";

/**
 * Uploads parameters for re-generating a corner plot to the database
 * @param plotData Object containing all of the different configurations for the corner plot
 * @returns The uploaded corner plot's UUID in the database
 */
export const savePlotData = (plotData: SavePlotData): string => {
    // Generate a new uuid for the corner plot
    const cornerId = uuidv4();
    plotData.corner_id = cornerId;

    // Generate a new uuid for each dataset configuration
    plotData.dataset_configs.forEach((dataset_config) => {
        dataset_config.dataconf_id = uuidv4();
    });

    // Upload corner plot to database
    // TODO: determine whether this should return cornerId or call res.status(???).send(cornerId)

    insertPlotData(plotData);
    return cornerId;

    // try {
    //     uploadPlotData(plotData)
    //     res.status(200).send(cornerId)
    // } catch (err) {
    //     res.status(500).send(err)
    // }
};
