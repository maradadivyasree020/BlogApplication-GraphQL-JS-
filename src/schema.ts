import { gql } from "apollo-server";

export const typeDefs = gql`
    type Query{
        posts: [Post!]!
    }
    
    type Mutation{
        postCreate(post: PostInput!): PostPayLoad!
        postUpdate(postId: ID!,post: PostInput!): PostPayLoad!
        postDelete(postId: ID!): PostPayLoad!
    }

    type Post{
        id: ID!
        title: String!
        content: String!
        createdAt: String
        published: Boolean
        User: User!
    }

    type User{
        id:ID!
        name:String!
        email: String!
        profile: Profile!
        posts: [Post!]!
    }

    type Profile{
        id: ID!
        bio: String
        user: [User!]!
    }

    type UserError{
        message: String!
    }

    type PostPayLoad{
        userErrors:[UserError!]!
        post: Post
    }

    input PostInput{
        title: String,
        content: String
    }

`