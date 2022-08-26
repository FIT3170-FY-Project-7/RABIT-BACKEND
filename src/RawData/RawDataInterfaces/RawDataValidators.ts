import * as t from "io-ts";

export const RawDataListValidator = t.type({});
export type RawDataList = t.TypeOf<typeof RawDataListValidator>;

export const RawDataGetValidator = t.type({});
export type RawDataGet = t.TypeOf<typeof RawDataGetValidator>;
