import { profile } from "console"
import { Context } from "../index"
import { getUserFromToken } from "../utils/getUserFromToken"

export const Query = {
    posts: async (parent: any,args: any,{prisma}: Context) => {
        const posts= await prisma.post.findMany({
            orderBy:[
                {
                    createdAt:"desc"
                },
            ]
        })
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