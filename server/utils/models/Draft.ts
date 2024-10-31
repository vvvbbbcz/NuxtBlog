import {model, Schema} from 'mongoose'

const draft = {
    _id: {type: Number},
    // URL 标题
    urlName: {type: String},
    // 标题
    title: {type: String},
    // 封面
    cover: {type: Number, ref: 'Picture'},
    // 内容 (markdown)
    markdown: {type: String},
    // 标签 id
    tagId: [{type: Number, ref: 'Tag'}],
    // 作者
    author: {type: Number, ref: 'User'},
    // 是否可见
    visible: {type: Boolean, default: true}
}

const schema = new Schema(draft);

export {draft};

export default model('Draft', schema);
