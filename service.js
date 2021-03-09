require('dotenv').config();
const mongoose = require('mongoose');
const schemas = require('./schemas.js');
const messageSchema = schemas.messageSchema;
class Message {

    constructor(board = null) {
        //this.model = mongoose.model(`${project}_board`, messageSchema);
        this.board = board
        messageSchema.pre('updateOne', function () {
            this.set({ bumped_on: new Date() });
        });
        this.model = new mongoose.model(`board`, messageSchema);
    }

    async createThread(obj) {
        try {
            obj.board = this.board
            const thread = new this.model(obj);
            let response = await thread.save();
            return response;
        } catch (error) {
            if (error.name == 'ValidationError') {
                return { error: 'required field(s) missing' }
            }
            return error;
        }
    };

    async createReply(obj) {
        try {
            const thread = await this.model.findOne({ _id: obj.thread_id });
            if (!thread) {
                return 'thread not exists';
            }
            thread.reply.push(obj);
            thread.bumped_on = new Date().toISOString();
            thread.replycount = thread.reply.length;
            thread.reply = thread.reply.sort(item => item.created_on)
            let response = await thread.save();
            return response;
        } catch (error) {
            if (error.name == 'ValidationError') {
                return { error: 'required field(s) missing' }
            }
            return error;
        }
    };

    async deleteReply(obj) {
        try {
            let thread = await this.model.findOne({_id: obj.thread_id});
            let reply = await thread.reply.id(obj.reply_id);
            if (!reply) {
                return "Doesn't exists reply"
            }
            if (reply.delete_password != obj.delete_password) {
                return "incorrect password"
            }
            reply.text = "[deleted]";
            let response = await thread.save();
            return "success";
        } catch (error) {
            return error;
        }
    }

    async deleteThread(obj) {
        try {
            let thread = await this.model.findOne({ _id: obj.thread_id });
            if (!thread) {
                return "Don't exists thread"
            }
            if (thread.delete_password != obj.delete_password) {
                return "incorrect password"
            }
            thread.text = "[deleted]";

            let response = await thread.save();
            return "success";
        } catch (error) {
            return error;
        }
    }

    async updateThread(obj) {
        try {
            let thread = await this.model.findOne({ _id: obj.thread_id });
            if (!thread) {
                return "Don't exists thread"
            }
            thread.reported = true;
            let response = await thread.save();
            return "success";
        } catch (error) {
            return error;
        }
    }

    async updateReply(obj) {
        try {
            let thread = await this.model.findOne({_id: obj.thread_id});
            let reply = await thread.reply.id(obj.reply_id);

            if (!reply) {
                return "Doesn't exists reply"
            }
            reply.reported = true;
            let response = await thread.save();
            return "success";
        } catch (error) {
            return error;
        }
    }

    async getThreads(obj) {
        try {
            obj.board = this.board
            let response = await this.model.find(obj, {
                reply: {
                    $slice: 3,
                },
            })
                .limit(10)
                .select({
                    reported: 0,
                    delete_password: 0,
                })
                .sort({ created_on: -1 });

            return response;
        } catch (error) {
            return error;
        }
    };

    async getReplies(obj) {
        try {
            obj.board = this.board
            let response = await this.model.find(obj, {
                 reply: {
                     $slice: 3,
                 },
            })
                .limit(10)
                .select({
                    reported: 0,
                    delete_password: 0,
                })
                .sort({ created_on: -1 });

            return response;
        } catch (error) {
            return error;
        }
    };
}
exports.Message = Message;