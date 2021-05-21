const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true },
    owner: { type: String, required: true },
    active: { type: Boolean, required: true ,default:false},
    trainers:[Schema.Types.ObjectId],
    attachments: { type: String, },
    rating: [{
        accountId: { type: Schema.Types.ObjectId, required: true },
        rate: Number
    }],
    Quizzes: { type: String },
    comments: [{
        accountId: { type: Schema.Types.ObjectId, required: true },
        content: String,
        created: { type: Date, default: Date.now },
    }],
    tags: [String], // web,development, front
    created: { type: Date, default: Date.now },
    updated: Date,
    chat: [{
        accountId: { type: Schema.Types.ObjectId, required: true },
        content: String,
        created: { type: Date, default: Date.now },
    }],
});



module.exports = mongoose.model('Course', schema);