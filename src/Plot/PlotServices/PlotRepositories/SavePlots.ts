import {
    SavePlotData,
    DatasetConfig,
    PlotConfig,
    PlotParams,
} from "../../PlotInterfaces/SavePlotData";
import {
    INSERT_CORNER_PLOT,
    INSERT_PARAMETER_CONFIG,
    INSERT_DATASET_CONFIG,
    INSERT_DATASET_QUANTILE,
    INSERT_DATASET_SIGMA,
} from "./PlotQuerySQL";
import databaseConnection from "../../../databaseConnection";

// TODO: Determine what each DB-upload function should return on success

const insertCornerPlot = (plotData: SavePlotData) => {
    // Extract corner plot data
    const corner_id = plotData.corner_id;
    const current_datetime = new Date();
    const collection_id = plotData.collection_id;
    const user_id = plotData.user_id;

    // Extract plot config data
    const plot_config = plotData.plot_config;
    const plot_size = plot_config.plot_size;
    const subplot_size = plot_config.subplot_size;
    const margin_horizontal = plot_config.margin.horizontal;
    const margin_vertical = plot_config.margin.vertical;
    const axis_size = plot_config.axis.size;
    const axis_tick_size = plot_config.axis.tick_size;
    const axis_ticks = plot_config.axis.ticks;
    const background_color = plot_config.background_color;

    databaseConnection.query(
        INSERT_CORNER_PLOT,
        [
            corner_id,
            current_datetime,
            current_datetime,
            collection_id,
            user_id,
            plot_size,
            subplot_size,
            margin_horizontal,
            margin_vertical,
            axis_size,
            axis_tick_size,
            axis_ticks,
            background_color,
        ],
        (err) => {
            if (err) {
                // TODO: Throw the error here?

                console.log(err);
            } else {
                // Possibly remove this, make function return void?
            }
        }
    );

    // Return something here?
};

const insertParameterConfigs = (
    corner_id: string,
    parameterConfigs: PlotParams[]
) => {
    parameterConfigs.forEach((parameterConfig) => {
        // TODO: work out how to handle parameter name here (wrong parameter for DB)
        const parameter_name = parameterConfig.name;
        const domain_min = parameterConfig.domain[0];
        const domain_max = parameterConfig.domain[1];

        databaseConnection.query(
            INSERT_PARAMETER_CONFIG,
            [corner_id, parameter_name, domain_max, domain_min],
            (err) => {
                if (err) {
                    // TODO: Throw the error here?

                    console.log(err);
                }
            }
        );
    });

    // Possibly return something here, or void
};

const insertDatasetConfigs = (
    corner_id: string,
    datasetConfigs: DatasetConfig[]
) => {
    datasetConfigs.forEach((datasetConfig) => {
        const dataconf_id = datasetConfig.dataconf_id;
        const dataset_id = datasetConfig.dataset_id;
        const bins = datasetConfig.bins;
        const color = datasetConfig.color;
        const line_width = datasetConfig.line_width;
        const blur_radius = datasetConfig.blur_radius;

        databaseConnection.query(
            INSERT_DATASET_CONFIG,
            [
                dataconf_id,
                corner_id,
                dataset_id,
                bins,
                color,
                line_width,
                blur_radius,
            ],
            (err) => {
                // TODO: Throw the error here?

                console.log(err);
            }
        );

        insertDatasetSigmas(dataconf_id, datasetConfig.sigmas);
        insertDatasetQuantiles(dataconf_id, datasetConfig.quantiles);
    });

    // Return something here?
};

const insertDatasetSigmas = (dataconf_id: string, sigmas: number[]) => {
    sigmas.forEach((sigma) => {
        databaseConnection.query(
            INSERT_DATASET_SIGMA,
            [dataconf_id, sigma],
            (err) => {
                // TODO: Throw the error here?

                console.log(err);
            }
        );
    });

    // Return something here?
};

const insertDatasetQuantiles = (dataconf_id: string, quantiles: number[]) => {
    quantiles.forEach((quantile) => {
        databaseConnection.query(
            INSERT_DATASET_QUANTILE,
            [dataconf_id, quantile],
            (err) => {
                // TODO: Throw the error here?

                console.log(err);
            }
        );
    });

    // Return something here?
};

export const insertPlotData = (plotData: SavePlotData) => {
    // TODO: Determine whether try-catch block should be here or in the associated service
    try {
        const corner_id = plotData.corner_id;

        insertCornerPlot(plotData);
        insertParameterConfigs(corner_id, plotData.parameters);
        insertDatasetConfigs(corner_id, plotData.dataset_configs);

        return corner_id;
    } catch (err) {}
};
