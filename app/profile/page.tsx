'use client'
import UserProfile from "@/components/UserProfile"
import { useSession } from "next-auth/react"

export default function ProfilePage(){

    const {data: session} = useSession()
    console.log(session)
    return(
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
            <UserProfile user={session?.user}/>
        </div>
    )
}