import { User } from "next-auth";

interface UserProfileProps {
    user?: User | null;
}

export default function UserProfile({ user }: UserProfileProps){

    console.log("userprofile", user)
    return(
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col items-center mb-6">
                <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{user?.name || "User Profile"}</h2>
                <p className="text-xs text-slate-400 mt-1">{user?.email || "No email available"}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                        UserName
                    </label>
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 truncate">
                        {user?.name || "N/A"}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Email
                    </label>
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 truncate">
                        {user?.email || "N/A"}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Shared Id
                    </label>
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-400 truncate">
                        {user?.id || "N/A"}
                    </div>
                </div>
            </div>
        </div>
    )
}