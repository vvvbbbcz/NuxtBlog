import { mapStruct, toBoolean, toNumber, toNumberArray, toString } from "../dbTypes";
import { fromDB as userFromDB, type User } from "./user";
import { fromDB as tagFromDB, type Tag, type TagFromDB } from "./tag";

interface Article {
    id?: number,
    url?: string,
    title?: string,
    markdown?: string,
    abstract?: string,
    html?: string,
    tag?: (number | Tag)[],
    year?: number,
    date?: string,
    author?: number | User,
    password?: string,
    iv?: number[],
    visible?: number,
    drafted?: boolean,
    deleted?: boolean,
}

interface ArticleFromDB {
    _id?: number | null,
    ur?: string | null,
    ti?: string | null,
    md?: string | null,
    ab?: string | null,
    ht?: string | null,
    tg?: number[] | null,
    yr?: number | null,
    da?: string | null,
    au?: number | null,
    pw?: string | null,
    iv?: number[] | null,
    vi?: number | null,
    dr?: boolean | null,
    de?: boolean | null,
}

interface ArticleToDB {
    _id?: number,
    ur?: string,
    ti?: string,
    md?: string,
    ab?: string,
    ht?: string,
    tg?: number[],
    yr?: number,
    da?: string,
    au?: number,
    pw?: string,
    iv?: number[],
    vi?: number,
    dr?: boolean,
    de?: boolean,
}

function fromDB(dbData: ArticleFromDB | null): Article | null {
    if (!dbData) return null;

    return mapStruct(dbData, {
        id: toNumber('_id'),
        url: toString('ur'),
        title: toString('ti'),
        markdown: toString('md'),
        abstract: toString('ab'),
        html: toString('ht'),
        tag: {
            from: 'tg',
            transform: (v: (number | TagFromDB)[]) => v
                .map((i) => i instanceof Object ? tagFromDB(i) : Number(i))
                .filter((i) => i !== null)
        },
        year: toNumber('yr'),
        date: toString('da'),
        author: {
            from: 'au',
            transform: (v: any) => (v instanceof Object ? userFromDB(v) : Number(v)) || undefined
        },
        password: toString('pw'),
        iv: toNumberArray('iv'),
        visible: toNumber('vi'),
        drafted: toBoolean('dr'),
        deleted: toBoolean('de'),
    });
}

function toDB(data: Article): ArticleToDB {
    return mapStruct(data, {
        _id: toNumber('id'),
        ur: toString('url'),
        ti: toString('title'),
        md: toString('markdown'),
        ab: toString('abstract'),
        ht: toString('html'),
        tg: {
            from: 'tag',
            transform: (v: (number | Tag)[]) => {
                return v
                    .map((i) => i instanceof Object ? (i.id || null) : Number(i))
                    .filter((i) => i !== null)
            }
        },
        yr: toNumber('year'),
        da: toString('date'),
        au: {
            from: 'author',
            transform: (v: number | User) => {
                return v instanceof Object ? (v.id || undefined) : Number(v)
            }
        },
        pw: toString('password'),
        iv: toNumberArray('iv'),
        vi: toNumber('visible'),
        dr: toBoolean('drafted'),
        de: toBoolean('deleted'),
    });
}

export {
    fromDB,
    toDB,
}

export type { Article }
