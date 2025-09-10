import { User } from "../../generated/prisma";
import { Context } from "../../index";
import validator from "validator"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import {JSON_SIGNATURE} from "../../keys"

interface SignupArgs{
    email:string
    name:string
    password: string
    bio: string
}

interface userPayLoad{
    userErrors:{
        message: string
    }[];
    token : string | null
}

export const authResolver = {
    signup:async (parent: any,{user}: {user:SignupArgs},{prisma}:Context) : Promise<userPayLoad> =>{
        const { email, name, password, bio } = user;

        const isEmail = validator.isEmail(email);
        if(!isEmail){
            return{
                userErrors: [{
                    message:"Invalid Email"
                }],
                token: null
            }
        }

        const isValidPassword = validator.isLength(password,{
            min: 5
        });
        if(!isValidPassword){
            return{
                userErrors: [{
                    message:"Invalid Password"
                }],
                token: null
            }
        }

        if(!name || !bio){
            return{
                userErrors:[
                    {
                        message:"Invalid name or bio"
                    },
                ],
                token:null,
            }
        }
        
        const hashedPassword=await bcrypt.hash(password,10)

        const createdUser = await prisma.user.create({
            data:{
                email,name,password: hashedPassword,bio,
            }
        })

        await prisma.profile.create({
            data: {
                bio,
                userId: createdUser.id, 
            }
        });

        const token = await JWT.sign({
            userId: createdUser.id,
        },JSON_SIGNATURE,{
            expiresIn:360000,
        })
        return{
            userErrors:[],
            token: token
        }

    },
    signin:async (parent: any,{user}: {user:SignupArgs},{prisma}:Context) : Promise<userPayLoad> =>{
        const { email, password } = user;

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })
        if(!existingUser){
            return{
                userErrors:[
                    {
                        message: "User doesn't exist",
                    }
                ],
                token: null,
            }
        }

        const isCorrectPassword = await bcrypt.compare(password,existingUser.password)
        if(!isCorrectPassword){
            return{
                userErrors:[
                    {
                        message: "Incorrect Password",
                    }
                ],
                token: null
            }
        }

        return ({
            userErrors:[],
            token:null
        })

    },  

}