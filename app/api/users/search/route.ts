import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";




export async function GET(req:Request){
    try{
        const session = await auth()
        if(!session?.user){
            return NextResponse.json({error:"No User Find"},{status:401})
        }
        const {searchParams}= new URL(req.url)
        const query=searchParams.get("q")

        if(!query || !query.trim()){
            return NextResponse.json({users:[]},{status:200})
        }
        const currentUserId=parseInt(session.user.id,10)
        const users= await prisma.user.findMany({
            where:{
                username:{
                    contains:query.trim(),
                    mode:"insensitive"
                },
                id:{
                    not:isNaN(currentUserId)? undefined:currentUserId
                }
            },
            select:{
                id:true,
                username:true,
                email:true
            },
            take:10
        })
        return NextResponse.json({users},{status:200})
    }catch(err){
        return NextResponse.json({error:"Failed to search users"},{status:200})
    }
}