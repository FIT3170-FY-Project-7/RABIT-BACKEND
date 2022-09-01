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
  const posteriors = data.posterior.content;

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