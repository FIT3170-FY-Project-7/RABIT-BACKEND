import { RowDataPacket } from "mysql2";

export interface ParameterConfigRow extends RowDataPacket {
  parameter_id: string;
  parameter_name: string;
  file_id: string;
  domain_max: string;
  domain_min: string;
}

export type ParameterConfigParsed = {
  parameter_id: string;
  parameter_name: string;
  file_id: string;
  domain: [number, number];
};

export interface DatasetSigmaRow extends RowDataPacket {
  sigma_value: string;
}

export interface DatasetQuantileRow extends RowDataPacket {
  quantile_value: string;
}

export interface DatasetConfigRow extends RowDataPacket {
  dataconf_id: string;
  file_id: string;
  bins: string;
  color: string;
  line_width: string;
  blur_radius: string;
  sigmas: number[];
  quantiles: number[];
}

export type DatasetConfigParsed = {
  dataconf_id: string;
  file_id: string;
  bins: number;
  color: string;
  line_width: number;
  blur_radius: number;
  sigmas: number[];
  quantiles: number[];
  data: Object;
};

export interface CornerPlotRow extends RowDataPacket {
  corner_id: string;
  last_modified: string;
  date_created: string;
  collection_id: string;
  user_id: string;
  plot_size: string;
  subplot_size: string;
  margin_horizontal: string;
  margin_vertical: string;
  axis_size: string;
  axis_ticksize: string;
  axis_ticks: string;
  background_color: string;
}

export type CornerPlotParsed = {
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
      tickSize: number;
      ticks: number;
    };
    background_color: string;
  };
};

export type FullCornerPlotData = CornerPlotParsed & {
  dataset_configs: DatasetConfigParsed[];
  parameter_configs: ParameterConfigParsed[];
};
