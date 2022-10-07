import * as t from "io-ts";

export const RawDataListValidator = t.type({});
export type RawDataList = t.TypeOf<typeof RawDataListValidator>;

export const RawDataGetValidator = t.type({});
export type RawDataGet = t.TypeOf<typeof RawDataGetValidator>;

export const RawDataFileIdsValidator = t.type({ fileCount: t.number });
export type RawDataFileIds = t.TypeOf<typeof RawDataFileIdsValidator>;

const FileDetailsValidator = t.type({
  id: t.string,
  name: t.string
});

export type FileDetails = t.TypeOf<typeof FileDetailsValidator>;

export const RawDataProcessValidator = t.type({
  title: t.string,
  description: t.string,
  fileDetails: t.array(FileDetailsValidator)
});

export type RawDataProcess = t.TypeOf<typeof RawDataProcessValidator>;

export const RawDataChunkValidator = t.type({
  fileId: t.string,
  chunkCount: t.string // Chunks are sent through form data which can't contain numbers
});

export type RawDataChunk = t.TypeOf<typeof RawDataChunkValidator>;
