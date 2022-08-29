import databaseConnection, {
  PlotCollection,
  FilePointer,
  Upload
} from "../../../databaseConnection";
import { GET_PLOT_COLLECTION } from "../../uploadSql";

/**
 * Gets data about each file/dataset used in a plot collection
 * @param collection_id The UUID of the plot collection
 * @returns An array containing data for each file used in the plot collection
 */
export const getPlotCollectionDataset = async (
  collection_id: string
): Promise<(PlotCollection | FilePointer | Upload)[]> => {
  const [rows] = await databaseConnection.query<
    (PlotCollection | FilePointer | Upload)[]
  >(GET_PLOT_COLLECTION, [collection_id]);

  return rows;
};
