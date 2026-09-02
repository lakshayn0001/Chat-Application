import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const session = await auth()
        if(!session?.user){
            return NextResponse.json({error:"Unauthorised"},{status:401})
        }
        const currentUserId = parseInt(session.user.id,10)
        if(isNaN(currentUserId)){
            return NextResponse.json({error:"Invalid User ID"},{status:400})
        }

        const friendShips= await prisma.friendRequest.findMany({
            where:{
                status:"ACCEPTED",
                OR:[
                    {senderID:currentUserId},
                    {receiverID:currentUserId}
                ]
            },
            include:{
                sender:{
                    select:{
                        id:true,
                        username:true,
                        email:true
                    }
                },
                receiver:{
                    select:{
                        id:true,
                        email:true,
                        username:true
                    }
                }
            }
        })

        const friends= friendShips.map((f)=>{
            return f.senderID === currentUserId ? f.receiver: f.sender 
        })

        return NextResponse.json({friends},{status:200})
    }catch(err){
        return NextResponse.json({error:"Failed to fetch friend"},{status:500})
    }
}