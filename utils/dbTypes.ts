type Mapper<S, T> = {
    [K in keyof T]: {
        from: keyof S
        transform?: (value: any) => T[K]
    }
}

function mapStruct<S extends Record<string, any>, T extends Record<string, any>>(
    source: S,
    mapper: Mapper<S, T>
): Partial<T> {
    const result: Partial<T> = {}

    for (const key in mapper) {
        const { from, transform } = mapper[key]

        if (from in source && source[from] !== null && source[from] !== undefined) {
            const value = source[from]
            result[key] = transform ? transform(value) : value
        }
    }

    return result
}

function toString<S>(key: keyof S) {
    return {
        from: key,
        transform: (v: any) => String(v)
    }
}

function toNumber<S>(key: keyof S) {
    return {
        from: key,
        transform: (v: any) => Number(v)
    }
}

function toNumberArray<S>(key: keyof S) {
    return {
        from: key,
        transform: (v: any) => v.map((i: any) => Number(i))
    }
}

function toBoolean<S>(key: keyof S) {
    return {
        from: key,
        transform: (v: any) => Boolean(v)
    }
}

export { mapStruct, toNumber, toString, toBoolean, toNumberArray }
export type { Mapper }

