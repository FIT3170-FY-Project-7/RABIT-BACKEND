import * as t from "io-ts";

export const RawDataUploadValidator = t.type({
  name: t.string
  // files: t.array(t.)
});
export type RawDataUpload = t.TypeOf<typeof RawDataUploadValidator>;

export const RawDataListValidator = t.type({});
export type RawDataList = t.TypeOf<typeof RawDataListValidator>;

export const RawDataGetValidator = t.type({});
export type RawDataGet = t.TypeOf<typeof RawDataGetValidator>;
