import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(){
    try{
        const sesion= await auth()
        if(!sesion?.user){
            return NextResponse.json({error:"unauthorized user"},{status:500})
        }
        const currentUserId = parseInt(sesion.user.id,10)

        if(isNaN(currentUserId)){
            return NextResponse.json({error:"Invalid error ID"},{status:400})
        }

        const request = await prisma.friendRequest.findMany({
            where:{
                receiverID: currentUserId,
                status:"PENDING"
            },
            include:{
                sender:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        return NextResponse.json({request},{status:200})
    }catch(err){
        return NextResponse.json({error:"Fail to fetch friend Request"})
    }
}