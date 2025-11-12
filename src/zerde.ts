import type { StandardSchemaV1 } from "@standard-schema/spec"

import type { ParseOptions } from "./parse"
import { defaultParseOptions, parseIt } from "./parse"
import { validateIt } from "./validate"

export type ZerdeOptions = Partial<{
    parse: ParseOptions
}>

export class Zerde {
    parseOptions = defaultParseOptions

    constructor(options: ZerdeOptions = {}) {
        this.parseOptions = { ...options.parse, ...defaultParseOptions }
    }

    parse = <Schema extends StandardSchemaV1>(
        unknownContent: unknown,
        schema: Schema,
        parseOptions?: string | Partial<ParseOptions>,
    ) => {
        if (typeof unknownContent === "string") {
            const parseOpts =
                typeof parseOptions === "string"
                    ? { format: parseOptions }
                    : parseOptions
            const mergedOptions = { ...parseOpts, ...this.parseOptions }

            return parseIt(unknownContent, mergedOptions).asyncAndThen(
                (unknownContent) => validateIt(unknownContent, schema),
            )
        }
        return validateIt(unknownContent, schema)
    }
}
