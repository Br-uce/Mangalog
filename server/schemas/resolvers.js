const { User, Review, Manga, Comment } = require('../models');
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
        user: async (parent, args, context) => {
            if (context.user) {
                return await User.findById(context.user._id);
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
        addReview: async (parent, reviewData, context) => {
            if (context.user) {
              const review = new Review(reviewData);
      
              await User.findByIdAndUpdate(context.user._id, { $push: review });
      
              return review;
            }
      
            throw AuthenticationError;
        },
        addComment: async (parent, commentData, context) => {
            if (context.user) {
              const comment = new Comment(commentData);
      
              await User.findByIdAndUpdate(context.user._id, { $push: comment });
      
              return comment;
            }
      
            throw AuthenticationError;
        },
    }
}

module.exports = resolvers;