import { fromThrowable } from "neverthrow"

import type { StringifyJSONOptions } from "./formats/json"
import { defaultStringifyJSONOptions, stringifyJSON } from "./formats/json"
import type { StringifyYAMLOptions } from "./formats/yaml"
import { stringifyYAML } from "./formats/yaml"
import { EnhancedError, extractFormatSuffix } from "./utils"

export class StringifyError extends EnhancedError {}

export type StringifyOptions = Partial<{
    json: StringifyJSONOptions
    yaml: StringifyYAMLOptions
}>

export const defaultStringifyOptions = {
    json: defaultStringifyJSONOptions,
    yaml: {},
} as const satisfies StringifyOptions

export const stringifyIt = fromThrowable(
    (
        unknownContent: unknown,
        formatAndStringifyOptions: Partial<
            StringifyOptions & { format: string }
        >,
    ) => {
        if (typeof unknownContent === "string") {
            return unknownContent
        }
        const { format, ...otherOptions } = formatAndStringifyOptions
        const suffix = extractFormatSuffix(format ?? "")
        if (suffix === "yaml" || suffix === "yml") {
            return stringifyYAML(unknownContent, otherOptions.yaml)
        }
        // default to JSON stringify if unknown suffix
        return stringifyJSON(unknownContent, otherOptions.json)
    },
    (e) => new StringifyError("Could not stringify content", { cause: e }),
)
