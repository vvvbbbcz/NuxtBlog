import {model, Schema} from 'mongoose'

const schema = new Schema({
	_id: {type: Number},
	// 文件名
	name: {type: String},
	// 时间
	date: {type: String},
	// URL
	url: {type: String},
	// 上传者的用户id
	uid: {type: Number, ref: 'User'},
	// 是否公开
	visible: {type: Boolean, default: true}
})

export default model('Picture', schema)
