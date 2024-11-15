import {model, Schema} from 'mongoose'

const schema = new Schema({
	_id: {type: Number},
	username: {type: String},
	password: {
		type: String,
		select: false
	},
	nickname: {type: String},
	email: {type: String},
	avatar: {type: Number, ref: 'Picture'},
	admin: {type: Boolean, default: false}
})

export default model('User', schema)
