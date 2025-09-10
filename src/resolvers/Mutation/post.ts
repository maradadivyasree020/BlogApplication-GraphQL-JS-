import { Post, Prisma } from "../../generated/prisma";
import { Context } from "../../index";

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
    postCreate : async(parent: any,{post}: PostArgs,{prisma}: Context) : Promise<PostPayLoadType> => {
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
                            authorId:1,
                        },
                    })
        }
    },
    postUpdate : async(parent:any,{ postId, post }: { postId: string; post: PostArgs["post"] },{prisma}:Context) =>{
        const {title,content} = post
        if(!title && !content){
            return{
                userErrors:[{
                    message: "You must atleast provide title or content"
                }],
                post: null,
            };
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
    postDelete : async(parent:any,{postId}:{ postId: string },{prisma}:Context) =>{
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
}