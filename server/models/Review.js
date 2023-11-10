const mongoose = require('mongoose');

const { Schema } = mongoose;
// A Schema to hold all useful information for a Review, such as the Rating and possible comment for said rating.
// Also needs to link to the Manga.
const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 3,
    },
    description: {
        type: String,
    },
    manga: {
        type: Schema.Types.ObjectId,
        ref: 'Manga',
        required: true
      }
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;