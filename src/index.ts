import { ApolloServer,gql } from "apollo-server";
import { typeDefs } from "./schema";
import { Query,Mutation } from "./resolvers";
import { PrismaClient,Prisma } from "./generated/prisma";

export const prisma = new PrismaClient()

export interface Context{
    prisma: PrismaClient<
            Prisma.PrismaClientOptions,
            never>;
            // Prisma.RejectNotFound | Prisma.RejectPerOperation | undefined>;
}

const server = new ApolloServer({
    typeDefs,
    resolvers:{
        Query,Mutation
    },
    context:{
        prisma
    }
})

server.listen().then(({url})=>{
    console.log(`Server on ${url}`);
})