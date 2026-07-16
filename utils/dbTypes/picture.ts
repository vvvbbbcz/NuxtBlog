import { mapStruct, toNumber, toString } from "../dbTypes";
import { fromDB as userFromDB, type User } from "./user";

interface Picture {
    id?: number,
    url?: string,
    date?: string,
    uploader?: number | User,
}

interface PictureFromDB {
    _id?: number | null,
    ur?: string | null,
    da?: string | null,
    au?: number | null,
}

interface PictureToDB {
    _id?: number,
    ur?: string,
    da?: string,
    au?: number,
}

function fromDB(dbData: PictureFromDB | null): Picture | null {
    if (!dbData) return null;

    return mapStruct(dbData, {
        id: toNumber('_id'),
        url: toString('ur'),
        date: toString('da'),
        uploader: {
            from: 'au',
            transform: (v: any) => (v instanceof Object ? userFromDB(v) : Number(v)) ?? undefined
        }
    });
}

function toDB(data: Picture): PictureToDB {
    return mapStruct(data, {
        _id: toNumber('id'),
        ur: toString('url'),
        da: toString('date'),
        au: {
            from: 'uploader',
            transform: (v: number | User) => {
                return v instanceof Object ? (v.id ?? undefined) : Number(v)
            }
        }
    });
}

export { fromDB, toDB }
export type { Picture, PictureFromDB }
