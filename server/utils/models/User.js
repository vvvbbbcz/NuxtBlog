import {model, Schema} from 'mongoose'
import {sha256sum} from "~/server/utils/util";

const schema = new Schema({
	_id: {type: Number},
	username: {type: String},
	password: {
		type: String,
		select: false,
		set(value) {
			return sha256sum(value);
		}
	},
	nickname: {type: String},
	email: {type: String},
	avatar: {type: Number, ref: 'Picture'},
	admin: {type: Boolean, default: false}
})

export default model('User', schema)
