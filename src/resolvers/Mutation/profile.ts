import { Context } from "../../index"
import { Prisma, Profile } from "../../generated/prisma"

interface ProfileArgs{
    profile:{
        name?: string,
        bio?: string
    }
}

interface PostPayLoadType{
    userErrors:{
        message: string
    }[],
    profile: Profile | Prisma.Prisma__PostClient<Profile> | null
}

export const profileResolver ={
    profileCreate: async(parent:any,{profile}:ProfileArgs,{prisma,userInfo}:Context) : Promise<PostPayLoadType> => {
        if(!userInfo){
            return {
                userErrors:[{
                    message: "Forbidden Access"
                }],
                profile:null,
            }
        } 
        const {name,bio} = profile
        // console.log(name,bio);
        if(!name || !bio){
            return{
                userErrors:[{
                    message: "You must provide name and bio"
                }],
                profile:null,
            }
        }
        console.log(name,bio);
        return {
            userErrors:[],
            profile: await prisma.profile.create({
                        data:{
                            name,
                            bio,
                            userId:userInfo.userId,
                        }
            })
        }
    }
}