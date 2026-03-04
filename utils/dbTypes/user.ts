import { mapStruct, toNumber, toString } from "../dbTypes";

interface User {
    id?: number
    username?: string
    nickname?: string
    email?: string
    avatar?: number
    password?: string
    adminLevel?: number
}

interface UserFromDB {
    _id?: number | null
    ur?: string | null
    ti?: string | null
    md?: string | null
    co?: number | null
    pw?: string | null
    vi?: number | null
}

interface UserToDB {
    _id?: number
    ur?: string
    ti?: string
    md?: string
    co?: number
    pw?: string
    vi?: number
}

function fromDB(dbData: UserFromDB | null): User | null {
    if (!dbData) return null;

    return mapStruct(dbData, {
        id: toNumber('_id'),
        username: toString('ur'),
        nickname: toString('ti'),
        email: toString('md'),
        avatar: toNumber('co'),
        password: toString('pw'),
        adminLevel: toNumber('vi'),
    });
}

function toDB(data: User): UserToDB {
    return mapStruct(data, {
        _id: toNumber('id'),
        ur: toString('username'),
        ti: toString('nickname'),
        md: toString('email'),
        co: toNumber('avatar'),
        pw: toString('password'),
        vi: toNumber('adminLevel'),
    });
}

export { fromDB, toDB }
export type { User }
