const mongoose = require('mongoose');

const { Schema } = mongoose;
const User = require('./User');
// A Schema to hold all useful information for a comment, such as the comment itself, and who wrote it.
const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    user: User.Schema,
})

const Comment = mongoose.model('Comment', userSchema);

module.exports = Comment;