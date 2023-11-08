const mongoose = require('mongoose');

const { Schema } = mongoose;
const User = require('./User');
const Comment = require('./Comment');
// A Schema to hold all useful information for a Review, such as the Rating, comment for said rating, User who submitted the review.
// Possibly comments made in response to the review.
const mangaSchema = new Schema({
    Rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 3,
    },
    description: {
        type: String,
    },
    user: User.schema,
    comments: [Comment.Schema],
})

const Review = mongoose.model('Review', userSchema);

module.exports = Review;