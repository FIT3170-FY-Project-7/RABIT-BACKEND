import * as t from "io-ts";
import { nonEmptyArray, date } from "io-ts-types";

const PlotParamsValidator = t.type({
  name: t.string,
  file_id: t.string,
  domain: t.tuple([t.number, t.number])
});

export type PlotParams = t.TypeOf<typeof PlotParamsValidator>;

const PlotConfigValidator = t.type({
  plot_size: t.number,
  subplot_size: t.number,
  margin: t.type({
    horizontal: t.number,
    vertical: t.number
  }),
  axis: t.type({
    size: t.number,
    tickSize: t.number,
    ticks: t.number
  }),
  background_color: t.string
});

export type PlotConfig = t.TypeOf<typeof PlotConfigValidator>;

const DatasetConfigValidator = t.type({
  file_id: t.string,
  bins: t.number,
  color: t.string,
  line_width: t.number,
  blur_radius: t.number,
  sigmas: t.array(t.number),
  quantiles: t.array(t.number)
});

const DatasetConfigNonValidated = t.type({
  dataconf_id: t.string
});

const DatasetConfigFull = t.intersection([
  DatasetConfigValidator,
  DatasetConfigNonValidated
]);

export type DatasetConfig = t.TypeOf<typeof DatasetConfigFull>;

export const SavePlotDataValidator = t.type({
  user_id: t.string,
  collection_id: t.string,
  // name: t.string,
  parameters: nonEmptyArray(PlotParamsValidator),
  plot_config: PlotConfigValidator,
  dataset_configs: nonEmptyArray(DatasetConfigValidator)
});

// There is repetition here due to the awkward construction of dataset_configs between the validated and
// non-validated versions
const SavePlotDataNonValidated = t.type({
  corner_id: t.string,
  user_id: t.string,
  collection_id: t.string,
  // name: t.string,
  date_created: date,
  last_modified: date,
  parameters: nonEmptyArray(PlotParamsValidator),
  plot_config: PlotConfigValidator,
  dataset_configs: nonEmptyArray(DatasetConfigFull)
});

export type SavePlotData = t.TypeOf<typeof SavePlotDataNonValidated>;
