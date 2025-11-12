# Zerde

Typescript library for parsing and stringifying combined with schema validationg

When stringifying or parsing an object, you want to verify that what you are stringifying or parsing matches a schema.
This is the overall workflow:
Parsing: stringifiedContent -> parse -> SomeObject
Stringifying: SomeObject -> stringify -> stringifiedContent

However, all type safety is lost during these steps (especially during the parse step)

The desired workflow:

Parsing: stringifiedContent<SomeType> -> parse -> Unknown -> validateIsSomeType -> SomeType
Stringifying: SomeType -> validateIsSomeType -> stringify -> stringifiedContent<SomeType>

This way, you are able to parse some unknown string into a strongly typed result, and ensure that the object you are about to stringify matches the intended schema

The next step is each `parse`/`stringify` function is specific to one format. `JSON.parse`/`JSON.stringify` only handles `JSON`. What if you need to parse/stringify some other format? Import another library.

This library provides a unified way to parse, stringify and validate:

[x] JSON
[] YAML (coming soon)
[] TOML (coming soon)
[] CSV (coming soon)

Makes use of [Standard Schema](https://github.com/standard-schema/standard-schema) to support all the popular schema libraries (Zod, Valibot, etc).

## Quick Start

```ts
import { zparse, zstringify } from "zerde"
import { z } from "zod"

const personSchema = z.object({
    name: z.string(),
    age: z.number()
})

const aPerson = {
    name: "Some Name",
    age: 30
}

// Will check if aPerson matches the personSchema, then stringify the person
const stringifyResult = await zstringify(aPerson, personSchema)
//    ^stringifyResult is a neverthrow ResultAsync

if (stringifyResult.isOk()) {
    const stringifiedPerson = stringifyResult.data
    //    ^stringifiedPerson is '{"name":"Some Name","age":30}'

    // Will parse the stringifiedPerson, then check if the output matches the personSchema
    const parseResult = await zparse(stringifiedPerson, personSchema, "JSON")
    //    ^parseResult is a neverthrow ResultAsync
    
    if (parseResult.isOk()) {
        // This is the same aPerson from before
        const parsedPerson = parseResult.data
        
        assert(aPerson.name === parsedPerson.name)
        assert(aPerson.age === parsedPerson.age)
        
    } else {
        // this error could have been from parsing, or from validating agains the schema
        const parseError = parseResult.error
    }
    
} else {
    // This error could have been from stringifying, or from validating against the schema 
    const stringifyError = stringifyResult.error
}
```

## Specifying a Format

Can provide a format as a string:

```ts
zparse(someJSONstringifiedString, someSchema, "JSON")
```

Handles a wide variety of string cases:

| Case | Example |
| --- | --- |
| uppercase | "JSON" |
| lowercase | "json" |
| mixedcase | "jSoN" |
| extension | ".json" |
| file | "file.json" |
| file with path | "some/path/to/file.json" |
| file with a windows path | "some\\path\\to\\file.json" |
| basic media type | "application/json" |
| complex media type | "application/customFormat+json" |
| media type with charset | "application/customFormat+json; charset=utf-8" |


When calling `zparse`, if the unknownContent was not a string, or if no format is specified, or if the specified format is not supported, `zparse` will not modify the passed in content before validating it. So if you know you are parsing a `JSON.stringify`-ed string, pass `JSON` as the 3rd arg to `zparse`

When calling `zstringify`, if no format is specified, or if the specified format is not supported, `zparse` fall back to assuming the format was `JSON`.

