import {
  DatasetConfigRow,
  DatasetConfigParsed,
  ParameterConfigRow,
  ParameterConfigParsed,
  CornerPlotRow,
  CornerPlotParsed
} from "src/Plot/PlotInterfaces/GetPlotDataDTOs";

/**
 * Parses raw dataset config rows into the expected type and format
 * @param datasetConfigRows An array of raw dataset config rows
 * @returns A properly parsed and type-converted dataset config object
 */
export const parseDatasetConfigRows = (
  datasetConfigRows: DatasetConfigRow[]
): DatasetConfigParsed[] => {
  return datasetConfigRows.map((datasetConfigRow) => {
    return {
      dataconf_id: datasetConfigRow.dataconf_id,
      file_id: datasetConfigRow.file_id,
      bins: +datasetConfigRow.bins,
      color: datasetConfigRow.color,
      line_width: +datasetConfigRow.line_width,
      blur_radius: +datasetConfigRow.blur_radius,
      sigmas: datasetConfigRow.sigmas,
      quantiles: datasetConfigRow.quantiles,
      data: {}
    };
  });
};

/**
 * Parses raw parameter config rows into the expected type and format
 * @param parameterConfigRows An array of raw parameter config rows
 * @returns A properly parsed and type-converted parameter config object
 */
export const parseParameterConfigRows = (
  parameterConfigRows: ParameterConfigRow[]
): ParameterConfigParsed[] => {
  return parameterConfigRows.map((parameterConfigRow) => {
    return {
      parameter_id: parameterConfigRow.parameter_id,
      parameter_name: parameterConfigRow.parameter_name,
      file_id: parameterConfigRow.file_id,
      domain: [+parameterConfigRow.domain_min, +parameterConfigRow.domain_max]
    };
  });
};

/**
 * Parses a raw corner plot row into the expected type and format
 * @param datasetConfigRows A raw corner plot row
 * @returns A properly parsed and type-converted corner plot row
 */
export const parseCornerPlotRow = (
  cornerPlotRow: CornerPlotRow
): CornerPlotParsed => {
  return {
    corner_id: cornerPlotRow.corner_id,
    last_modified: new Date(cornerPlotRow.last_modified),
    date_created: new Date(cornerPlotRow.date_created),
    collection_id: cornerPlotRow.collection_id,
    user_id: cornerPlotRow.user_id,
    plot_config: {
      plot_size: +cornerPlotRow.plot_size,
      subplot_size: +cornerPlotRow.subplot_size,
      margin: {
        horizontal: +cornerPlotRow.margin_horizontal,
        vertical: +cornerPlotRow.margin_vertical
      },
      axis: {
        size: +cornerPlotRow.axis_size,
        tickSize: +cornerPlotRow.axis_ticksize,
        ticks: +cornerPlotRow.axis_ticks
      },
      background_color: cornerPlotRow.background_color
    }
  };
};
