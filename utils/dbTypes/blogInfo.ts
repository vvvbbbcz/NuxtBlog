import { mapStruct, toNumber, toString } from "../dbTypes";

interface BlogInfo {
    _id?: number | null,
    name?: string | null,
    separator?: string | null,
    description?: string | null,
    background?: number | null,
    icon?: number | null,
}

interface BlogInfoDB {
    _id?: number | null,
    ti?: string | null,
    md?: string | null,
    ab?: string | null,
    co?: number | null,
    au?: number | null,
}

function fromDB(dbData: BlogInfoDB): BlogInfo {
    return mapStruct(dbData, {
        name: toString('ti'),
        separator: toString('md'),
        description: toString('ab'),
        background: toNumber('co'),
        icon: toNumber('au'),
    });
}

function toDB(data: BlogInfo): BlogInfoDB {
    let dbData: BlogInfoDB = mapStruct(data, {
        ti: toString('name'),
        md: toString('separator'),
        ab: toString('description'),
        co: toNumber('background'),
        au: toNumber('icon'),
    });
    return dbData
}

export {
    fromDB,
    toDB,
}

