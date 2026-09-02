import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req:Request){
    try{
        const session = await auth()
        if(!session?.user){
            return NextResponse.json({error:"Unaithorized User"},{status:400})
        }

        const {searchParams}= new URL(req.url)

        const receiverParams=searchParams.get("receiverId")
        if(!receiverParams){
            return NextResponse.json({error:"ReceiverId is required"},{status:400})
        }
        const currentUserId=parseInt(session.user.id,10)
        const receiverId = parseInt(receiverParams,10)

        if(isNaN(currentUserId) || isNaN(receiverId)){
            return NextResponse.json({error:"Invalid User ID"},{status:400})
        }
        const receiverUser = await prisma.user.findUnique({
            where:{id: receiverId}
        })

        if(!receiverUser){
            return NextResponse.json({error:"User Not Found"},{status:404})
        }

        const isFriend= await prisma.friendRequest.findFirst({
            where:{
                status:"ACCEPTED",
                OR:[
                    {senderID: currentUserId, receiverID: receiverId},
                    {senderID: receiverId,receiverID:currentUserId}
                ]
            }
        })
        if(!isFriend){
            return NextResponse.json({error:"you can only send messages to accepted friends"},{status:403})
        }

        const message=await prisma.message.findMany({
            where:{
                OR:[
                    {senderId:currentUserId,recieverId:currentUserId},
                    {senderId:receiverId,recieverId:currentUserId}
                ]
        },
        orderBy:{
            createdAt:"asc"
        }
        }
    )
        return NextResponse.json({message},{status:200})



    }catch(err){
        return NextResponse.json({error:"Failed to send message"},{status:500})
    }
}

export async function POST(req:Request){
    try{
        const session= await auth()
        if(!session?.user){
            return NextResponse.json({error:"Unauthorized User"},{status:401})
        }
        const body=await req.json()
        const {receiverId,content}=body

        if(!receiverId || !content){
            return NextResponse.json({error:"receiverId and content must required"},{status:400})
        }
        const currentUserId=parseInt(session.user.id,10)
        const receiverID= parseInt(receiverId,10)

        if(isNaN(currentUserId) || isNaN(receiverID)){
            return NextResponse.json({error:"Invalid User Id"},{status:400})
        }
        const reveiverUser= await prisma.user.findUnique({
            where:{id:receiverID}
        })
        if(!reveiverUser){
            return NextResponse.json({error:"User Not Found"},{status:404})
        }

        const isFriend= await prisma.friendRequest.findFirst({
            where:{
                status:"ACCEPTED",
                OR:[
                    {senderID:currentUserId,receiverID},
                    {senderID:receiverID,receiverID:currentUserId}
                ]
            }
        })

        if(!isFriend){
            return NextResponse.json({error:"You Can only Send messages to accepted friends"},{status:403})
        }
        const newMessage= await prisma.message.create({
            data:{
                senderId:currentUserId,
                recieverId:receiverId,
                content:content.trim()
            }
        })
        return NextResponse.json({message:newMessage},{status:201})

    }catch(err){
        return NextResponse.json({error:"Failed to send the message"},{status:500})
    }
}