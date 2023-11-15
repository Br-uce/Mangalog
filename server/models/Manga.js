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
    image: {
        type: String,
    },
    avgRating: {
        type: Number,
        default: 0,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
})

const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga;