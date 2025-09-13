import { Context } from ".."

interface canUserMutatePostParams{
    userId:number ,
    postId:number,
    prisma: Context["prisma"]
}
export const canUserMutatePost = async ({
    userId,
    postId,
    prisma
}: canUserMutatePostParams) =>{
    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    });
    if(!user){
        return{
            userErrors :[
                {
                    message : "User Not Found"
                }
            ],
            post:null,
        }
    }
    const post = await prisma.post.findUnique({
        where:{
            id: postId
        }
    })
    if(post?.authorId !== user.id){
        return{
            userErrors:[
                {
                    message:"Post not owned by user"
                }
            ],
            post: null
        }
    }
}