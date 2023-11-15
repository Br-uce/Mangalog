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
                // As a new review has been made, the Manga's rating must be updated.
                const mangaID = review.manga._id;
                const manga = await Manga.findById(mangaID);
                // In order to get the correct original ratings, the original values are copied for this.
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
                const review = await Review.findByIdAndDelete(reviewData.reviewID);
                await User.findByIdAndUpdate(reviewData.userID, { $pull: { reviews: review } });
                // As a review has been removed, the Manga model needs to be updated.
                const mangaID = review.manga._id;
                const manga = await Manga.findById(mangaID);
                // In order to get the correct original ratings, the original values are copied for this.
                // reviewCount is a variable, to allow for subtraction from it. -1 would work as well, but this lays it out better.
                var reviewCount = manga.reviewCount;
                const totalRating = manga.avgRating * reviewCount;
                reviewCount--;
                const avgRating = (totalRating-review.rating)/(reviewCount);
                await Manga.findByIdAndUpdate(mangaID, {avgRating: avgRating, reviewCount: reviewCount});
                return review;
            //}
        
            throw AuthenticationError;
        },
        // Currently setup to bypass Context, for server-only testing. Do not actually try to use for Client-side mutations.
        updateReview: async(parent, updateData, context) => {
            //if (context.user) {
                // Copying the original Review, in case updating the review breaks the review.
                const originalReview = await Review.findById(updateData.reviewID);
                const review = await Review.findByIdAndUpdate(updateData.reviewID, updateData, { new: true, });
                // In the event that the review fails to be made, this should prevent it from trying to update everything with a null review.
                if(review) {
                    await User.findByIdAndUpdate(updateData.userID, {$pull: {reviews: originalReview} });
                    await User.findByIdAndUpdate(updateData.userID, {$push: {reviews: review} });
                    const mangaID = review.manga._id;
                    const manga = await Manga.findById(mangaID);
                    // This is for updating the rating, as the updated review might have updated the rating.
                    if(originalReview.rating != review.rating) {
                    var reviewCount = manga.reviewCount;
                    const totalRating = (manga.avgRating * reviewCount)-originalReview.rating;
                    const avgRating = (totalRating+review.rating)/(reviewCount);
                    await Manga.findByIdAndUpdate(mangaID, {avgRating: avgRating, reviewCount: reviewCount});
                    }
                    return review;
                }
                else{
                    await Review.findByIdAndUpdate(updateData.reviewID, originalReview);
                    return Error("Error: Failed to update.");
                }
            //}
        
            throw AuthenticationError;
        }
    }
}

module.exports = resolvers;