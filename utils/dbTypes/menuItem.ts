import { mapStruct, toNumber, toString, toBoolean } from "../dbTypes";

interface MenuItem {
    id?: number,
    url?: string,
    label?: string,
    subMenu?: (MenuItem | number)[],
    page?: number,
    pos?: number,
    newTab?: boolean
    external?: boolean
}

interface MenuItemFromDB {
    _id?: number | null,
    ur?: string | null,
    ti?: string | null,
    tg?: number[] | null,
    au?: number | null,
    vi?: number | null,
    dr?: boolean | null,
    de?: boolean | null
}

interface MenuItemToDB {
    _id?: number,
    ur?: string,
    ti?: string,
    tg?: number[],
    au?: number,
    vi?: number,
    dr?: boolean,
    de?: boolean
}

function fromDB(dbData: MenuItemFromDB | null): MenuItem | null {
    if (!dbData) return null;

    return mapStruct(dbData, {
        id: toNumber('_id'),
        url: toString('ur'),
        label: toString('ti'),
        subMenu: {
            from: 'tg',
            transform: (v: (number | MenuItemFromDB)[]) => v
                .map((i) => i instanceof Object ? fromDB(i) : Number(i))
                .filter((i) => i !== null)
        },
        page: toNumber('au'),
        pos: toNumber('vi'),
        newTab: toBoolean('dr'),
        external: toBoolean('de'),
    });
}

function toDB(data: MenuItem): MenuItemToDB {
    return mapStruct(data, {
        _id: toNumber('id'),
        ur: toString('url'),
        ti: toString('label'),
        tg: {
            from: 'subMenu',
            transform: (v: (number | MenuItem)[]) => v
                .map((i) => i instanceof Object ? (i.id || null) : Number(i))
                .filter((i) => i !== null)
        },
        au: toNumber('page'),
        vi: toNumber('pos'),
        dr: toBoolean('newTab'),
        de: toBoolean('external'),
    });
}

export { fromDB, toDB }
export type { MenuItem }
