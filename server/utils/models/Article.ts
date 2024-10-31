import {model, Schema} from 'mongoose'

const article = {
    ...draft,
    // 摘要
    abstract: {type: String},
    // html
    content: {type: String},
    // 发布日期
    publishDate: {type: String},
    // 更新日期
    updateDate: {type: String}
}

const schema = new Schema(article);

export {article}

export default model('Article', schema);
