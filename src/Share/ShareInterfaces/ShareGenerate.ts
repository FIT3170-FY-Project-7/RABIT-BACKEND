import * as t from "io-ts";

export const ShareGenerateValidator = t.type({
    id: t.string,
    name: t.string,
    parameters: t.array(t.string),
});

export type ShareGenerate = t.TypeOf<typeof ShareGenerateValidator>;
