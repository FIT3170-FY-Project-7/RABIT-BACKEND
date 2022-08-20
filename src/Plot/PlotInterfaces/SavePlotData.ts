import * as t from "io-ts";

export const SavePlotDataValidator = t.type({
    id: t.string,
    name: t.string,
    parameters: t.array(t.string),
});

export type SavePlotData = t.TypeOf<typeof SavePlotDataValidator>;
