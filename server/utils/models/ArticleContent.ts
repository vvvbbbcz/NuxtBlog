import {model, Schema} from 'mongoose'

const schema = new Schema({
	_id: {type: Number},
	// html
	content: {type: String},
});

export default model('ArticleContent', schema);
