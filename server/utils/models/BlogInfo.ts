import {model, Schema} from 'mongoose'

const schema = new Schema({
	// 博客名称
	name: {type: String},
	// 图标
	icon: {type: Number},
	// 分隔符
	separator: {type: String},
	// 背景图
	background: {type: String},
	// 所有者
	owner: {type: Number},
	// 最新的 articleID
	articleID: {type: Number},
	tagID: {type: Number},
	pictureID: {type: Number},
	userID: {type: Number}
});

export default model('BlogInfo', schema)
