import { model, Schema } from 'mongoose'

const schema = new Schema({
	// article > 0
	// blog info = 0
	// -128 <= user < 0
	// -256 <= menu items < -128
	// -8,192 <= tag < -256
	// picture < -8,192
	_id: Number,

	// article: url name
    // blog info: always null
	// menu item: url
	// user: username
	// tag: url name
	// picture: url
	ur: {
		type: String, required: function () {
			return this._id !== 0;
		}
	},

	// article: title
	// blog info: name
	// tag: name
	// user: nickname
	ti: String,

	// article: markdown
	// blog info: separator
	// user: email
	md: String,

	// article: abstract
	// blog info: description (optional)
	ab: String,

	// article: html
	ht: String,

	// article: cover
	// blog info: background
	// user: avatar
	co: { type: Number, ref: 'BlogData' },

	// article: tags
	tg: [{ type: Number, ref: 'BlogData' }],

	// article: publish year
    // blog info: always null
    // user: always 0
    // menu item: always 1
    // tag: always 2
    // picture: always 3
	yr: {
		type: Number, required: function () {
			return this._id > 0;
		}
	},

	// article: publish or update date 
	// picture: upload date
	da: String,

	// article: author
	// blog info: icon
	// picture: uploader
	au: { type: Number, ref: 'BlogData' },

	// article: password
	// user: password
	pw: { type: String, select: false },

	// article: encrypt aes iv
	iv: [{ type: Number }],

	// article: visible (public = 0, private = 1, encrypted > 1)
	// user: admin level (root = 0, admin = 1, editor = 2, author = 3, contributor = 4, user > 4)
	vi: Number,

	// article: draft
	dr: { type: Boolean, default: true },

	// article: deleted
	de: { type: Boolean, default: false },
});

schema.index({ yr: -1, ur: 1 }, { unique: true });

export default model('BlogData', schema);
