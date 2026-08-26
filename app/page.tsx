import { auth } from "@/auth";
import UserDropDown from "@/components/UserDropdown";



export default async function Home() {

  const session = await auth()
  const fakeListofuser = ["john", "michael", "justin", "tomholan"]
 

  console.log("session",session)
  return (
    <div className="grid grid-cols-[280px_1fr] grid-rows-[64px_1fr] h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <div className="col-span-2 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-6 font-semibold text-slate-200">
        <UserDropDown user={session?.user} />
        <div id="applicationName" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          ChatMode
        </div>
      </div>
      <div className="border-r border-slate-800 bg-slate-900/30 p-4 space-y-1 overflow-y-auto">
        {fakeListofuser.map((value, index) => {
          return <h1 key={index} className="p-3 rounded-xl hover:bg-slate-800/50 text-slate-300 font-medium text-sm cursor-pointer capitalize transition-colors border border-transparent hover:border-slate-700/40">{value}</h1>
        })}
      </div>
      <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-slate-800 bg-slate-900/20 text-sm font-medium text-slate-300">
            Who to send the message
          </div>
          <div className="flex-1 p-6 overflow-y-auto text-slate-400">
            Message area
          </div>
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 px-4 focus-within:border-indigo-500/50">
            <input className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none" placeholder="Text Here ......." />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"><h1>Send</h1></button>
          </div>
        </div>
      </div>
    </div>
  );
}
