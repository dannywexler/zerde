import type {
    CreateNodeOptions,
    DocumentOptions,
    ParseOptions,
    SchemaOptions,
    ToJSOptions,
    ToStringOptions,
} from "yaml"
import { parse, stringify } from "yaml"

// -------------- PARSE --------------

export type ParseYAMLOptions = DocumentOptions &
    ParseOptions &
    SchemaOptions &
    ToJSOptions

export function parseYAML(
    stringifiedContent: string,
    parseOptions?: ParseYAMLOptions,
): unknown {
    return parse(stringifiedContent, parseOptions)
}

// -------------- STRINGIFY --------------

export type StringifyYAMLOptions = CreateNodeOptions &
    DocumentOptions &
    ParseOptions &
    SchemaOptions &
    ToStringOptions

export function stringifyYAML(
    unknownContent: unknown,
    stringifyOptions?: StringifyYAMLOptions,
) {
    return stringify(unknownContent, {
        sortMapEntries: true,
        ...stringifyOptions,
    })
}
