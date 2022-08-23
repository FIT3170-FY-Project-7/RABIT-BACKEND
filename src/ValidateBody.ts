/**
 * Adapted from:
 *      - validateType: https://bharatkalluri.com/posts/runtime-data-validation-typescript
 *      - validateBody: https://urosstok.com/blog/input-validation-in-express-ts
 */
import * as t from "io-ts";
import { either } from "fp-ts";
import { NextFunction, Request, Response } from "express";

/**
 * Validate raw JSON data against an interface
 * @param rawData Raw JSON data
 * @param validator An interface (created using io-ts) to validate against
 * @returns The rawData if it matched the interface
 * @throws An Error if the rawData and validator don't match
 */
export const validateType = (rawData: any, validator: t.TypeC<any>): any => {
    const decodeRaw = validator.decode(rawData);
    const decodedInfo = either.fold(
        (errors: Array<t.ValidationError>) => {
            throw new Error(
                "Type validation failed for: " +
                    errors.map((err) =>
                        err.context
                            .map((contextInfo) => contextInfo.key)
                            .join("\n")
                    )
            );
        },
        (data) => data
    )(decodeRaw);

    return decodedInfo;
};

/**
 * Performs validation directly in an Express endpoint, returns a status 400 if there was an error, and
 * otherwise forwards functionality to the next function in the endpoint
 * @param validator An io-ts validator class to check the Request's body against
 * @returns Either the next function in the call chain, or sends a response with status 400
 */
const validateBody = (validator: t.TypeC<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            validateType(req.body, validator);
            return next();
        } catch (e) {
            return res.status(400).send(e.message);
        }
    };
};

export default validateBody;
