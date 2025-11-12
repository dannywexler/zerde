import type { StandardSchemaV1 } from "@standard-schema/spec"

import type { ParseOptions } from "./parse"
import { defaultParseOptions, parseIt } from "./parse"
import type { StringifyOptions } from "./stringify"
import { defaultStringifyOptions, stringifyIt } from "./stringify"
import { validateIt } from "./validate"

export type ZerdeOptions = Partial<{
    parse: ParseOptions
    stringify: StringifyOptions
}>

export class Zerde {
    parseOptions = defaultParseOptions
    stringifyOptions = defaultStringifyOptions

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
            const mergedOptions = { ...this.parseOptions, ...parseOpts }

            return parseIt(unknownContent, mergedOptions).asyncAndThen(
                (unknownContent) => validateIt(unknownContent, schema),
            )
        }
        return validateIt(unknownContent, schema)
    }

    stringify = <Schema extends StandardSchemaV1>(
        unknownContent: unknown,
        schema: Schema,
        stringifyOptions?: string | Partial<StringifyOptions>,
    ) => {
        const stringifyOpts =
            typeof stringifyOptions === "string"
                ? { format: stringifyOptions }
                : stringifyOptions
        const mergedOptions = { ...this.stringifyOptions, ...stringifyOpts }

        return validateIt(unknownContent, schema).andThen((validContent) =>
            stringifyIt(validContent, mergedOptions),
        )
    }
}

export const zerde = new Zerde()
export const zparse = zerde.parse
export const zstringify = zerde.stringify
