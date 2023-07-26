import mongoose, { Mongoose } from "mongoose";

const requestSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    comments: {type: [String], default: []},
     createdAt: {
        type: Date,
        default: new Date()
     },
});

const requestMessage = mongoose.model('requestMessage', requestSchema);
export default requestMessage;