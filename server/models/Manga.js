const mongoose = require('mongoose');

const { Schema } = mongoose;
const Review = require('./Review');
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
    reviews: [Review.Schema],
})

const Manga = mongoose.model('Manga', userSchema);

module.exports = Manga;