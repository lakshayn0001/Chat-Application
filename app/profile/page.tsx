'use client'
import UserProfile from "@/components/UserProfile"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function ProfilePage() {

    const { data: session } = useSession()
    console.log(session)
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative">
            <Link 
                href="/"
                className="absolute top-6 left-6 text-sm text-slate-400 hover:text-white flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
                ← Back to Chat
            </Link>
            <UserProfile user={session?.user} />
        </div>
    )
}