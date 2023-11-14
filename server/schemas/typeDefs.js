const typeDefs = `
type Manga {
    _id: ID
    title: String
    description: String
    avgRating: Float
    reviewCount: Int
}
type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    reviews: [Review]
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
    users: [User]
    user(_id: ID!): User
}
type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    addReview(rating: Int!, description: String, userID:ID!, manga: ID!): Review
    removeReview(userID: ID!, reviewID: ID!): Review
}
`;

module.exports = typeDefs;