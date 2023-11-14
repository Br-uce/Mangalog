const { TypeInfo } = require('graphql');
const { User, Review, Manga } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        mangas: async () => {
            return await Manga.find();
        },
        manga: async (parent, _id) => {
            return await Manga.findById(_id);
        },
        review: async (parent, _id) => {
            return await Review.findById(_id);
        },
        users: async () => {
            return await User.find();
        },
        user: async (parent, context, _id) => {
            //if (context.user) {
                return await User.findById(_id);
            //}
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
        },
        updateUser: async (parent, args, context) => {
            if (context.user) {
              return User.findByIdAndUpdate(context.user.id, args, {
                new: true,
              });
            }
      
            throw AuthenticationError;
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw AuthenticationError;
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(user);
      
            return { token, user };
        },
        // Currently setup to bypass Context, for server-only testing. Do not actually try to use for Client-side mutations.
        addReview: async (parent, reviewData, context) => {
            //if (context.user) {
                const review = await Review.create({
                    rating: reviewData.rating,
                    description: reviewData.description,
                    manga: reviewData.manga
                });
                await User.findByIdAndUpdate(reviewData.userID, { $push: { reviews: review } });
                const mangaID = review.manga._id;
                const manga = await Manga.findById(mangaID);
                var reviewCount = manga.reviewCount;
                const totalRating = manga.avgRating * reviewCount;
                reviewCount++;
                const avgRating = (totalRating+review.rating)/(reviewCount);
                await Manga.findByIdAndUpdate(mangaID, {avgRating: avgRating, reviewCount: reviewCount});
                return review;
            //}
      
            throw AuthenticationError;
        },
        // Currently setup to bypass Context, for server-only testing. Do not actually try to use for Client-side mutations.
        removeReview: async(parent, reviewData, context) => {
            //if (context.user) {
                console.log(reviewData);
                const review = await Review.findByIdAndDelete(reviewData.reviewID);
                console.log(review);
                await User.findByIdAndUpdate(reviewData.userID, { $pull: { reviews: review } });
                const mangaID = review.manga._id;
                console.log(mangaID);
                const manga = await Manga.findById(mangaID);
                console.log(manga);
                var reviewCount = manga.reviewCount;
                const totalRating = manga.avgRating * reviewCount;
                reviewCount--;
                const avgRating = (totalRating-review.rating)/(reviewCount);
                await Manga.findByIdAndUpdate(mangaID, {avgRating: avgRating, reviewCount: reviewCount});
                return review;
            //}
        
            throw AuthenticationError;
        }
    }
}

module.exports = resolvers;