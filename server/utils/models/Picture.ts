import {model, Schema} from 'mongoose'

const schema = new Schema({
	_id: {type: Number},
	// 内容
	src: {type: String},
	// 时间
	date: {type: String},
	// （外部图床图片）URL
	url: {type: String},
	// 上传者的用户id
	uid: {type: Number, ref: 'User'}
})

export default model('Picture', schema)
