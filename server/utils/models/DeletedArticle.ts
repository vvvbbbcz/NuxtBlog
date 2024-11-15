import {model, Schema} from 'mongoose'
import {article} from "~/server/utils/models/Article";

const schema = new Schema(article);

export default model('DeletedArticle', schema);
