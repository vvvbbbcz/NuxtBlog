import {model, Schema} from 'mongoose'

const blogInfo = new Schema({
	name: String,
	icon: {type: Number, ref: 'BlogData'},
	separator: String,
	background: {type: Number, ref: 'BlogData'},
}, {_id: false});


const schema = new Schema({
	_id: Number, // >0: article, 0: blog info, -1,000~-1: user, -100,000~-1,001: tag, <-100,001: picture
	blogInfo: blogInfo, // in article and tag, it is undefined
	ur: { // article url / tag url / username / picture url
		type: String, required: function () {
			return this._id !== 0;
		}
	},
	ti: String, // article title / tag name / user nickname
	md: String, // markdown / user email
	ab: String, // abstract
	ht: String, // html
	co: {type: Number, ref: 'BlogData'}, // cover / user avatar
	tg: [{type: Number, ref: 'BlogData'}], // tags
	yr: { // publish year
		type: Number, required: function () { // 0-user, 1-tag
			return this._id >= -100000 && this._id !== 0;
		}
	},
	pu: String, // publish date / picture upload date
	up: String, // update date
	au: {type: Number, ref: 'BlogData'}, // author / picture uploader
	pw: {type: String, select: false}, // article password / user password
	// article visible: 0-public, 1-private, >1-encrypted
	// user admin level (0-root, 1-admin, 2-editor, 3-author, 4-contributor, >4-user)
	vi: Number,
	dr: {type: Boolean, default: true}, // draft
	de: {type: Boolean, default: false}, // deleted
});

schema.index({yr: -1, ur: 1}, {unique: true});

export default model('BlogData', schema);
