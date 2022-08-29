import * as t from "io-ts";

export const ShareLinkGenerateValidator = t.type({
    id: t.string,
    name: t.string,
    parameters: t.array(t.string)
});

export type ShareLinkGenerate = t.TypeOf<typeof ShareLinkGenerateValidator>;
