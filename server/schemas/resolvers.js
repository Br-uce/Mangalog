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
            if (context.user) {
                return await User.findById(_id);
            }
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
        // This needs to alter the Manga's avgRating and reviewCount as well.
        addReview: async (parent, reviewData, context) => {
            if (context.user) {
                const review = new Review(reviewData);
      
                await User.findByIdAndUpdate(context.user._id, { $push: review });
            
                await Manga.findByIdAndUpdate(reviewData.manga._id, {$push: review});

                return review;
            }
      
            throw AuthenticationError;
        },
    }
}

module.exports = resolvers;