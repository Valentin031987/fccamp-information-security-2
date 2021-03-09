const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const replySchema = new mongoose.Schema({
    text: { type: String, required: true },
    delete_password: { type: String, required: true },
    reported: { type: Boolean, default: false },
    created_on: { type: Date, default: new Date().toUTCString() },
});

const  messageSchema = new mongoose.Schema({
    board: { type: String },
    text: { type: String, required: true },
    delete_password: { type: String, required: true },
    replycount: { type: Number, default: 0 },
    reply: [replySchema],
    reported: { type: Boolean, default: false },
    created_on: { type: Date, default: new Date().toUTCString() },
    bumped_on: { type: Date, default: new Date().toUTCString() },
}, { versionKey: false });

exports.messageSchema = messageSchema