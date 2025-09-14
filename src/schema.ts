import { gql } from "apollo-server";

export const typeDefs = gql`
    type Query{
        me:User
        posts: [Post!]!
    }
    
    type Mutation{
        postCreate(post: PostInput!): PostPayLoad!
        postUpdate(postId: ID!,post: PostInput!): PostPayLoad!
        postDelete(postId: ID!): PostPayLoad!
        postPublish(postId: ID!):PostPayLoad!
        postunPublish(postId: ID!):PostPayLoad!
        signup(credentials: CredentialsInput!,name: String!,bio: String!):AuthPayLoad!
        signin(credentials: CredentialsInput!):AuthPayLoad!
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
        bio: String!
        profile: Profile
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

    type AuthPayLoad{
        userErrors:[UserError!]!
        token: String
    }

    input PostInput{
        title: String,
        content: String
    }

    input CredentialsInput{
        email: String!
        password: String!
    }


`