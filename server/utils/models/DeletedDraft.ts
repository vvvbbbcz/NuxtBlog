import {model, Schema} from 'mongoose'
import {draft} from "~/server/utils/models/Draft";

const schema = new Schema(draft);

export default model('DeletedDraft', schema);
