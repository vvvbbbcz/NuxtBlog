import {model, Schema} from 'mongoose'

const schema = new Schema({
	_id: {type: Number},
	// 内容 (markdown)
	markdown: {type: String},
});

export default model('Markdown', schema);
