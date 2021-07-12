const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true },
    active: { type: Boolean, required: true, default: false },
    trainers: [Schema.Types.ObjectId],
    sections: [{
        addedBy: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        content: String,
        created: { type: Date, default: Date.now },
        updated: Date
    }],
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
    url_picture: String,
    chat: [{
        accountId: { type: Schema.Types.ObjectId, required: true },
        content: String,
        created: { type: Date, default: Date.now },
    }],
    visits: [
        {
            accountId: { type: Schema.Types.ObjectId, required: true },
            lastVisitedSection: String, //Last section that the user have visited
            occurences: [
                {
                    created: { type: Date, default: Date.now },
                }
            ]
        }
    ],
    labsConfiguration: { images: [String], templates: [String] }
});



module.exports = mongoose.model('Course', schema);