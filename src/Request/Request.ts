import { Query } from "express-serve-static-core";

export type RawDataRequestQuery = Query & { parameters: string };
