import * as t from "io-ts";

export const RawDataListValidator = t.type({});
export type RawDataList = t.TypeOf<typeof RawDataListValidator>;

export const RawDataGetValidator = t.type({});
export type RawDataGet = t.TypeOf<typeof RawDataGetValidator>;

export const RawDataFileIdsValidator = t.type({ fileCount: t.number });
export type RawDataFileIds = t.TypeOf<typeof RawDataFileIdsValidator>;

export const RawDataFileParameterBuckets = t.type({buckets: t.array(t.boolean)});
export type RawDataParamBooleans = t.TypeOf<typeof RawDataFileParameterBuckets>;

export const RawDataProcessValidator = t.type({
  title: t.string,
  description: t.string,
  fileIds: t.array(t.string)
});
export type RawDataProcess = t.TypeOf<typeof RawDataProcessValidator>;

export const RawDataChunkValidator = t.type({
  fileId: t.string,
  chunkCount: t.string // Chunks are sent through form data which can't contain numbers
});

export type RawDataChunk = t.TypeOf<typeof RawDataChunkValidator>;
