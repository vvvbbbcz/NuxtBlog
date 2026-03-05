const blogInfoId = 0;
const user_menuItem = -128;
const menuItem_tag = -256;
const tag_picture = -8192;

export default {
    article: {
        all: function (additional?: any) { return { _id: { $gt: blogInfoId }, ...additional } },
        published: function (additional?: any) { return { _id: { $gt: blogInfoId }, dr: false, de: false, ...additional } },
        updated: function (additional?: any) { return { _id: { $gt: blogInfoId }, dr: false, de: false, ...additional } },
        drafted: function (additional?: any) { return { _id: { $gt: blogInfoId }, dr: true, de: false, ...additional } },
        deleted: function (additional?: any) { return { _id: { $gt: blogInfoId }, de: true, ...additional } },
    },
    blog_info: function (additional?: any) { return { _id: blogInfoId, ...additional } },
    user: function (additional?: any) { return { _id: { $gte: user_menuItem, $lt: blogInfoId }, ...additional } },
    menuItem: function (additional?: any) { return { _id: { $gte: menuItem_tag, $lt: user_menuItem }, ...additional } },
    tag: function (additional?: any) { return { _id: { $gte: tag_picture, $lt: menuItem_tag }, ...additional } },
    picture: function (additional?: any) { return { _id: { $lt: tag_picture }, ...additional } },

    isArticle: function (id: number) { return id > blogInfoId },
    isBlogInfo: function (id: number) { return id === blogInfoId },
    isUser: function (id: number) { return id >= user_menuItem && id < blogInfoId },
    isMenuItem: function (id: number) { return id >= menuItem_tag && id < user_menuItem },
    isTag: function (id: number) { return id >= tag_picture && id < menuItem_tag },
    isPicture: function (id: number) { return id < tag_picture }
}
