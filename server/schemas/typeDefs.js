const typeDefs = `
type Manga {
    _id: ID
    title: String
    description: String
    avgRating: Int
    reviewCount: Int
}
type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    reviews: [Review]
    comments: [Comment]
}
type Review {
    _id: ID
    rating: Int
    description: String
    manga: Manga
}
type Auth {
    token: ID
    user: User
}
type Query {
    mangas: [Manga]
    manga(_id: ID!): Manga
    review(_id: ID!): Review
    user: User
}
type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    addReview(rating: Number!, description: String, manga: ID!): Review
}
`;

module.exports = typeDefs;