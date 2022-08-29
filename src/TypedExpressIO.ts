// Adapted from https://javascript.plainenglish.io/typed-express-request-and-response-with-typescript-7277aea028c
import { Request, Response } from "express";
import { Query, Send } from "express-serve-static-core";

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedRequestQuery<T extends Query> extends Request {
  query: T;
}

export interface TypedRequest<T, U extends Query> extends Request {
  body: T;
  query: U;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
