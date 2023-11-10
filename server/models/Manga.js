const mongoose = require('mongoose');

const { Schema } = mongoose;
// A Schema to hold all useful information for a Manga, such as the title, description, average rating, rating count, etc.
const mangaSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    // This has to update itself when a Review is added/removed.
    avgRating: {
        type: Number,
        default: 0,
    },
    // This also has to update itself when a Review is added/removed.
    reviewCount: {
        type: Number,
        default: 0,
    },
})

const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga;