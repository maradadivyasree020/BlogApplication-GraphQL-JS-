import { profile } from "console"
import { Context } from "../index"
import { getUserFromToken } from "../utils/getUserFromToken"

export const Query = {
    posts: async (parent: any,args: any,{prisma}: Context) => {
        const page = args.page || 1;
        const take = 3; // posts per page
        const skip = (page - 1) * take;
        const orderByField = args.orderBy || 'createdAt';
        const sortDirection = args.sortDirection || 'desc';
        const posts= await prisma.post.findMany({
            where: {
                authorId: args.userId, // filter posts by authenticated user
            },
            skip:skip,
            take:take,
            orderBy:{
                [orderByField]:sortDirection,
            }
        })
        console.log(posts)
        return posts
    },
    me: async (parent : any,args:any,{prisma,userInfo}:Context) =>{
        // if(!userInfo){
            // return null;
            // return{
            //     userErrors:[
            //         {
            //             message:"Cannot access this page"
            //         }
            //     ],
            //     post:null
            // }
        // }
        const userId=userInfo?.userId;
        const user = await prisma.user.findUnique({
            where:{
                id:userId,
            },
            include: { profile: true,posts:true },
        })
        console.log(userId,user)
        return user
            // userError:{
            //     message:null
            // },
        
    }
}