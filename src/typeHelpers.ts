type ObjectKeys<T extends object> = `${Exclude<keyof T, symbol>}`

export const objectKeys = Object.keys as <Type extends Record<string, unknown>>(
    value: Type,
) => Array<ObjectKeys<Type>>

export const objectEntries = Object.entries as <
    Type extends Record<string, unknown>,
>(
    value: Type,
) => Array<[ObjectKeys<Type>, Required<Type>[ObjectKeys<Type>]]>

export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}
