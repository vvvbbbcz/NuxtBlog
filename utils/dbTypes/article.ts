import { mapStruct, toBoolean, toNumber, toNumberArray, toString } from "../dbTypes";
import { fromDB as userFromDB, type User } from "./user";
import { fromDB as tagFromDB, type Tag } from "./tag";

interface Article {
    id?: number | null,
    url?: string | null,
    title?: string | null,
    markdown?: string | null,
    abstract?: string | null,
    html?: string | null,
    tag?: (number | Tag)[] | null,
    year?: number | null,
    date?: string | null,
    author?: number | User | null,
    password?: string | null,
    iv?: number[] | null,
    visible?: number | null,
    drafted?: boolean | null,
    deleted?: boolean | null,
}

interface ArticleDB {
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

function fromDB(dbData: ArticleDB | null): Article | null {
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
            transform: (v: any) => {
                let tags = [];
                for (let tagId of v) {
                    let tag = tagId instanceof Object ? tagFromDB(tagId) : Number(v);
                    if (tag) tags.push(tag);
                };
                return tags
            }
        },
        year: toNumber('yr'),
        date: toString('da'),
        author: {
            from: 'au',
            transform: (v: any) => {
                if (v instanceof Object) {
                    return userFromDB(v);
                }
                return Number(v);
            }
        },
        password: toString('pw'),
        iv: toNumberArray('iv'),
        visible: toNumber('vi'),
        drafted: toBoolean('dr'),
        deleted: toBoolean('de'),
    });
}

function toDB(data: any) {
    return mapStruct(data, {
        _id: toNumber('id'),
        ur: toString('url'),
        ti: toString('title'),
        md: toString('markdown'),
        ab: toString('abstract'),
        ht: toString('html'),
        tg: toNumberArray('tag'),
        yr: toNumber('year'),
        da: toString('date'),
        au: toNumber('author'),
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
