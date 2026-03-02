import { mapStruct, toNumber, toString } from "../dbTypes";

interface Tag {
    id?: number | null
    url?: string | null
    name?: string | null
}

interface TagDB {
    _id?: number | null
    ur?: string | null
    ti?: string | null
}

function fromDB(dbData: TagDB | null): Tag | null {
    if (!dbData) return null;

    return mapStruct(dbData, {
        id: toNumber('_id'),
        url: toString('ur'),
        name: toString('ti'),
    });
}

function toDB(data: Tag): TagDB {
    return mapStruct(data, {
        _id: toNumber('id'),
        ur: toString('url'),
        ti: toString('name'),
    });
}

export { fromDB, toDB }
export type { Tag, TagDB }
