import { RowDataPacket } from "mysql2";

export interface ParameterConfigRow extends RowDataPacket {
  parameter_id: string;
  parameter_name: string;
  file_id: string;
  domain_max: number;
  domain_min: number;
}

export interface DatasetSigmaRow extends RowDataPacket {
  sigma_value: number;
}

export interface DatasetQuantileRow extends RowDataPacket {
  quantile_value: number;
}

export interface DatasetConfigRow extends RowDataPacket {
  dataconf_id: string;
  file_id: string;
  bins: number;
  color: string;
  line_width: number;
  blur_radius: number;
  sigmas: number[];
  quantiles: number[];
}

export interface CornerPlotRow extends RowDataPacket {
  corner_id: string;
  last_modified: Date;
  date_created: Date;
  collection_id: string;
  user_id: string;
  plot_size: number;
  subplot_size: number;
  margin_horizontal: number;
  margin_vertical: number;
  axis_size: number;
  axis_ticksize: number;
  axis_ticks: number;
  background_color: string;
}

// TODO: update this to include place for the actual posterior data
export interface FullCornerPlotData {
  corner_id: string;
  last_modified: Date;
  date_created: Date;
  collection_id: string;
  user_id: string;
  plot_config: {
    plot_size: number;
    subplot_size: number;
    margin: {
        horizontal: number;
        vertical: number;
    };
    axis: {
        size: number;
        tick_size: number;
        ticks: number;
    };
    background_color: string;
  };
  dataset_configs: {
    dataconf_id: string;
    file_id: string;
    bins: number;
    color: string;
    line_width: number;
    blur_radius: number;
    sigmas: number[];
    quantiles: number[];
    data: Object
  }[];
  parameter_configs: {
    parameter_id: string;
    parameter_name: string;
    file_id: string;
    domain: [number, number]
  }[];
}
