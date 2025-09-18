import { gql } from "apollo-server";

export const typeDefs = gql`

    enum SortDirection {
        asc
        desc
    }

    enum PostSortableField {
        createdAt
        title
    }

    type Query{
        me:User
        posts(page:Int,userId:Int!,orderBy: PostSortableField = createdAt,sortDirection: SortDirection = desc): [Post!]!
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
        authorId: Int!
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