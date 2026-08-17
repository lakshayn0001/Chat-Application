import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";

export const POST= async(req:Response)=>{
    try{
        const body = await req.json()
        const {username,email,password} = body

        if(!username || !email || !password){
            return NextResponse.json({error:"Not able to get the username or email or password"},{status: 400})
        }

        if(password.length < 6){
            return NextResponse.json({error:"Password Length less than six"},{status:500})
        }
        const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const validEmail = emailRegx.test(email)

        if(!validEmail){
            return NextResponse.json({error:"Email is not valid"},{status:404})
        }

        const existingUserCheck = await prisma.user.findFirst({where:{OR: [{email},{username}]}})

        if(existingUserCheck){
            return NextResponse.json({error:"User are already Exist"},{status:409})
        }
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = await bcrypt.hash(password,salt)

        const user= await  prisma.user.create({
            data:{
                username,email,passwordHash
            }
        })

        return NextResponse.json({message:"User has been created Successfully",userId: user.username},{status:200})

    }catch(err){
        return NextResponse.json({error: err},{status:500})
    }
    
}