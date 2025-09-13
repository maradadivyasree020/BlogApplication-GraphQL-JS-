import { ApolloServer,gql } from "apollo-server";
import { typeDefs } from "./schema";
import { Query,Mutation } from "./resolvers";
import { PrismaClient,Prisma } from "./generated/prisma";
import { getUserFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient()

export interface Context{
    prisma: PrismaClient<
            Prisma.PrismaClientOptions,
            never>;
            // Prisma.RejectNotFound | Prisma.RejectPerOperation | undefined>;
    userInfo:{
        userId:number ;
    }| null
}

const server = new ApolloServer({
    typeDefs,
    resolvers:{
        Query,Mutation
    },
    context:async({req}:any):Promise<Context> => {
        // console.log({thisistheheader: req.headers.authorization})
        const userInfo = await getUserFromToken(req.headers.authorization)
        return{
            prisma,
            userInfo
        }
    }
})

server.listen().then(({url})=>{
    console.log(`Server on ${url}`);
})