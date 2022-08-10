// Adapted from https://bharatkalluri.com/posts/runtime-data-validation-typescript
import * as t from "io-ts";
import { either } from "fp-ts";

/**
 * Validate raw JSON data against an interface
 * @param rawData Raw JSON data
 * @param validator An interface (created using io-ts) to validate against
 * @returns The rawData if it matched the interface
 * @throws An Error if the rawData and validator don't match
 */
const validateType = (rawData: any, validator: t.TypeC<any>): any => {
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

export default validateType;
