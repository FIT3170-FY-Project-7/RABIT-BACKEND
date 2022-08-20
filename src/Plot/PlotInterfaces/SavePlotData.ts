import * as t from "io-ts";

const PlotParamsValidator = t.type({
    name: t.string,
    domain: t.tuple([t.number, t.number]),
});

export type PlotParams = t.TypeOf<typeof PlotParamsValidator>;

const PlotConfigValidator = t.type({
    plot_size: t.number,
    subplot_size: t.number,
    margin: t.type({
        horizontal: t.number,
        vertical: t.number,
    }),
    axis: t.type({
        size: t.number,
        tick_size: t.number,
        ticks: t.number,
    }),
    background_color: t.string,
});

export type PlotConfig = t.TypeOf<typeof PlotConfigValidator>;

const DatasetConfigValidator = t.type({
    dataset_id: t.string,
    bins: t.number,
    color: t.string,
    line_width: t.number,
    blur_radius: t.number,
    sigmas: t.array(t.number),
    quantiles: t.array(t.number),
});

export type DatasetConfig = t.TypeOf<typeof DatasetConfigValidator>;

export const SavePlotDataValidator = t.type({
    collection_id: t.string,
    name: t.string,
    parameters: t.array(PlotParamsValidator),
    plot_config: PlotConfigValidator,
    dataset_configs: t.array(DatasetConfigValidator),
});

const SavePlotDataOptional = t.type({
    // Depending on whether the backend can get user_id at any time after authentication,
    // user_id may need to be supplied in request body, and be added to the validator
    // instead of optional params
    user_id: t.string,
    corner_id: t.string,
});

const SavePlotDataFull = t.intersection([
    SavePlotDataValidator,
    SavePlotDataOptional,
]);

export type SavePlotData = t.TypeOf<typeof SavePlotDataFull>;