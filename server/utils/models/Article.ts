import {model, Schema} from 'mongoose'

const article = {
	_id: {type: Number},
	// URL 标题
	urlName: {type: String},
	// 标题
	title: {type: String},
	// markdown
	markdown: {type: Number, ref: 'Markdown'},
	// 摘要
	abstract: {type: String},
	// html
	content: {type: Number, ref: 'ArticleContent'},
	// 封面
	cover: {type: Number, ref: 'Picture'},
	// 标签
	tagId: [{type: Number, ref: 'Tag'}],
	// 发布年份
	year: {type: Number},
	// 发布日期
	publishDate: {type: String},
	// 更新日期
	updateDate: {type: String},
	// 作者
	author: {type: Number, ref: 'User'},
	// 是否可见
	visible: {type: Boolean, default: true},
	// 草稿
	draft: {type: Boolean, default: true},
	// 是否已删除
	deleted: {type: Boolean, default: false},
}

const schema = new Schema(article);

schema.index({year: -1, urlName: 1})

export default model('Article', schema);
