import { mapStruct, toNumber, toString } from "../dbTypes";

interface Tag {
    id?: number,
    url?: string,
    name?: string,
}

interface TagFromDB {
    _id?: number | null,
    ur?: string | null,
    ti?: string | null,
}

interface TagToDB {
    _id?: number,
    ur?: string,
    ti?: string,
}

function fromDB(dbData: TagFromDB | null): Tag | null {
    if (!dbData) return null;

    return mapStruct(dbData, {
        id: toNumber('_id'),
        url: toString('ur'),
        name: toString('ti'),
    });
}

function toDB(data: Tag): TagToDB {
    return mapStruct(data, {
        _id: toNumber('id'),
        ur: toString('url'),
        ti: toString('name'),
    });
}

export { fromDB, toDB }
export type { Tag }
