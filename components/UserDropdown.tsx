"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import UserProfile from "./UserProfile"
import {User} from "next-auth"

interface UserDropDownProps {
    user?: User | null
}

export default function UserDropDown({ user }: UserDropDownProps) {

    console.log(user?.name)

    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            console.log("dropdown ref", dropdownRef)
            if(dropdownRef.current && !dropdownRef.current.contains(e?.target as Node)){
                setOpen(!open)
            }
            document.addEventListener('mousedown',handleClickOutside)
            return ()=> document.removeEventListener('mousedown',handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        setOpen(!open)
        router.push('/login')
    }

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="text-sm font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                {user?.name || "User"}
            </button>
            {open && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 text-sm text-slate-300">
                        Signed in as<br />
                        <span className="font-semibold text-white block truncate mb-2">{user?.name || user?.email || "User"}</span>
                        <button
                            onClick={() => { router.push('/profile') }}
                            className="w-full text-left px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors block cursor-pointer font-medium mb-1"
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => { handleLogout() }}
                            className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors block cursor-pointer font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}