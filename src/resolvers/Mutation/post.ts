import { Post, Prisma } from "../../generated/prisma";
import { Context } from "../../index";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs{
    post:{
        title?: string
        content?: string
    }
}

interface PostPayLoadType{
    userErrors:{
        message: string
    }[],
    post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolver ={
    postCreate : async(parent: any,{post}: PostArgs,{prisma,userInfo}: Context) : Promise<PostPayLoadType> => {
        if(!userInfo){
            return {
                userErrors:[{
                    message: "Forbidden Access"
                }],
                post:null,
            }
        }
        const {title,content}=post
        if(!title || !content){
            return{
                userErrors:[{
                    message: "You must provide title and content"
                }],
                post: null,
            };
        } 
        return{
            userErrors:[],
            post:  await prisma.post.create({
                        data:{
                            title,
                            content,
                            authorId:userInfo.userId,
                        },
                    })
        }
    },
    postUpdate : async(parent:any,{ postId, post }: { postId: string; post: PostArgs["post"] },{prisma,userInfo}:Context) =>{
        if(!userInfo){
            return {
                userErrors:[{
                    message: "Forbidden Access"
                }],
                post:null,
            }
        }
        const {title,content} = post
        if(!title && !content){
            return{
                userErrors:[{
                    message: "You must atleast provide title or content"
                }],
                post: null,
            };
        } 
        const error =await canUserMutatePost({
            userId:userInfo.userId,
            postId: Number(postId),
            prisma
        })
        if(error){
            return error
        }
        const existingPost = await prisma.post.findUnique({
            where:{
                id:Number(postId)
            }
        })
        if(!existingPost){
            return{
                userErrors:[{
                    message: "Post does not exist"
                }],
                post: null,
            };
        } 

        let payloadToUpdate ={
            title,
            content
        }
        if(!title) delete payloadToUpdate.title;
        if(!content) delete payloadToUpdate.content;


        return{
            userErrors: [],
            post:await prisma.post.update({
                data:{
                    ...payloadToUpdate
                },
                where:{
                    id:Number(postId)
                }
            })
        }
    },
    postDelete : async(parent:any,{postId}:{ postId: string},{prisma,userInfo}:Context) =>{
        if(!userInfo){
            return {
                userErrors:[{
                    message: "Forbidden Access"
                }],
                post:null,
            }
        }
        const existingPost =await prisma.post.findUnique({
            where:{
                id:Number(postId)
            }
        })
        if(!existingPost){
            return{
                userErrors:[{
                    message: "Post does not exist"
                }],
                post: null,
            }
        };
        const error =await canUserMutatePost({
            userId:userInfo.userId,
            postId: Number(postId),
            prisma
        })
        if(error){
            return error
        }
        await prisma.post.delete({
            where:{
                id:Number(postId)
            }
        });
        return {
            userErrors: [],
            existingPost,
        }
    },
    postPublish : async(parent:any,{postId}:{ postId: string},{prisma,userInfo}:Context) =>{
        if(!userInfo){
            return {
                userErrors:[{
                    message: "Forbidden Access"
                }],
                post:null,
            }
        }
        const existingPost =await prisma.post.findUnique({
            where:{
                id:Number(postId)
            }
        })
        if(!existingPost){
            return{
                userErrors:[{
                    message: "Post does not exist"
                }],
                post: null,
            }
        };
        const error =await canUserMutatePost({
            userId:userInfo.userId,
            postId: Number(postId),
            prisma
        })
        if(error){
            return error
        }
        await prisma.post.update({
            where: {
                id: Number(postId)
            },
            data: {
                published: true 
            }
        });

        return {
            userErrors: [{
                message :"Post published",
            }],
            post:null
        }
    },
    postunPublish : async(parent:any,{postId}:{ postId: string},{prisma,userInfo}:Context) =>{
        if(!userInfo){
            return {
                userErrors:[{
                    message: "Forbidden Access"
                }],
                post:null,
            }
        }
        const existingPost =await prisma.post.findUnique({
            where:{
                id:Number(postId)
            }
        })
        if(!existingPost){
            return{
                userErrors:[{
                    message: "Post does not exist"
                }],
                post: null,
            }
        };
        const error =await canUserMutatePost({
            userId:userInfo.userId,
            postId: Number(postId),
            prisma
        })
        if(error){
            return error
        }
        await prisma.post.update({
            where: {
                id: Number(postId)
            },
            data: {
                published: false 
            }
        });

        return {
            userErrors: [{
                message :"Post unPublished",
            }],
            post:null
        }
    },
}