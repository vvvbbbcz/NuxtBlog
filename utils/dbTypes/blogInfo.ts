import { mapStruct, toNumber, toString } from "../dbTypes";
import { fromDB as pictureFromDB, type Picture } from "./picture";

interface BlogInfo {
    id?: number,
    name?: string,
    separator?: string,
    description?: string,
    background?: number | Picture,
    icon?: number,
}

interface BlogInfoFromDB {
    _id?: number | null,
    ti?: string | null,
    md?: string | null,
    ab?: string | null,
    co?: number | null,
    au?: number | null,
}

interface BlogInfoToDB {
    _id?: number,
    ti?: string,
    md?: string,
    ab?: string,
    co?: number,
    au?: number,
}

function fromDB(dbData: BlogInfoFromDB | null): BlogInfo | null {
    if (!dbData) return null;

    return mapStruct(dbData, {
        id: toNumber('_id'),
        name: toString('ti'),
        separator: toString('md'),
        description: toString('ab'),
        background: {
            from: 'co',
            transform: (v: any) => (v instanceof Object ? pictureFromDB(v) : Number(v)) ?? undefined
        },
        icon: toNumber('au'),
    });
}

function toDB(data: BlogInfo): BlogInfoToDB {
    return mapStruct(data, {
        _id: toNumber('id'),
        ti: toString('name'),
        md: toString('separator'),
        ab: toString('description'),
        co: {
            from: 'background',
            transform: (v: number | Picture) => {
                return v instanceof Object ? (v.id ?? undefined) : Number(v)
            }
        },
        au: toNumber('icon'),
    });
}

export { fromDB, toDB }
export type { BlogInfo }

