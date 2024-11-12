import {model, Schema} from 'mongoose'

const schema = new Schema({
	_id: {type: Number},
	urlName: {type: String},
	name: {type: String},
	articleID: [{type: Number, ref: 'Article'}]
})

export default model('Tag', schema);
