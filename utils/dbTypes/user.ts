import { mapStruct, toNumber, toString } from "../dbTypes";

interface User {
    id?: number | null
    username?: string | null
    nickname?: string | null
    email?: string | null
    avatar?: number | null
    password?: string | null
    adminLevel?: number | null
}

interface UserDB {
    _id?: number | null
    ur?: string | null
    ti?: string | null
    md?: string | null
    co?: number | null
    pw?: string | null
    vi?: number | null
}

function fromDB(dbData: UserDB | null): User | null {
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

function toDB(data: User): UserDB {
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
