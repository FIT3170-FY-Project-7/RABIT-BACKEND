import databaseConnection, {
  FilePointer,
  PlotCollection,
  Upload
} from "../../databaseConnection";
import { readRawDataFile } from "../storageController";
import { GET_PLOT_COLLECTION } from "../uploadSql";
import { getPlotCollectionDataset } from "./RawDataRepositories/RetrieveRawData";

/**
 * Gets all parameters that are common between all the datasets
 * @param data An array of datasets
 * @returns An array of parameter names common to each dataset
 */
export const calculateParameters = (data: any[]): string[] => {
  return (
    data.reduce((acc: string[], curr) => {
      // First iteration, include all keys of first dataset
      if (acc === null) {
        return Object.keys(curr.posterior.content);
      }

      // If acc has a key that is not in dataset, remove it
      for (const key of acc) {
        if (!curr.posterior.content[key]) {
          const index = acc.indexOf(key);
          acc.splice(index, 1);
        }
      }
      return acc;
    }, null) ?? []
  );
};

/**
 * Filters a dataset to only contain the requested posteriors
 * @param data An unfiltered, single dataset
 * @param requestedPosteriors An array of parameter names to extract from the posteriors
 * @returns A set of posterior data for only the requested parameter names
 */
export const filterPosteriorsFromDataset = (
  data: any,
  requestedPosteriors: string[]
) => {
  const posteriors = JSON.parse(data).posterior.content;
  return requestedPosteriors
    ? requestedPosteriors.reduce(
        (obj, key) => ({
          ...obj,
          [key]: posteriors[key]
        }),
        {}
      )
    : posteriors;
};

/**
 * Gets the data for a given plot collection filtered by an array of parameters. Only works when the
 * plot collection in question uses a single file/dataset
 * @param collection_id The UUID of a plot collection
 * @param queryPosteriors An array of parameter names
 * @returns The plot collection's name and posterior data, containing only the requested parameters
 */
export const getPosteriorData = async (
  collection_id: string,
  queryPosteriors: string[]
) => {
  // Get the file (single) used in the plot collection
  const rows = await getPlotCollectionDataset(collection_id);

  // Choose a row, and read its associated (single) file
  const row = rows[0];
  const data = await readRawDataFile(row.upload_id);

  // Filter the data from the file according to the requested posteriors
  const filteredPosteriors = filterPosteriorsFromDataset(data, queryPosteriors);

  return {
    name: row.collection_name,
    posteriors: filteredPosteriors
  };
};

/**
 * Gets the raw data for a plot collection. Also works when a plot collection contains multiple datasets
 * @param collection_id The UUID of the plot collection
 * @returns The plot collection's name, an array of parameter names that the plot collection can plot with,
 * and the data for the plot collection
 */
export const getMultipleRawData = async (collection_id: string) => {
  // Get the files contained in the plot collection
  const rows = await getPlotCollectionDataset(collection_id);

  // Get the full raw data for each file
  const rawDataFiles = rows.map((row) => readRawDataFile(row.file_id));
  const data = await Promise.all(rawDataFiles);

  // Extract common parameters between each file
  const common_parameters = calculateParameters(data);

  return {
    name: rows[0].collection_name,
    data: data,
    parameters: common_parameters
  };
};
