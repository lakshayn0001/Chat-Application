'use client';
import UserDropDown from "@/components/UserDropdown";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";



interface UserProfile{
  id:number;
  email:string;
  username: string
}

interface PendingRequest{
  id:string;
  senderID:number;
  receiverID: number;
  status:string;
  createdAt: string;
  sender:UserProfile;
}

interface Message{
  id:string;
  content:string;
  senderId:number;
  receiverId:number;
  createdAt:string;
}


export default  function Home() {

  const {data:session} = useSession()
  const [searchquery,setSearchQuery]=useState("")
  const [friends,setFriends]= useState<UserProfile[]>([])
  const [pendingRequest,setPendingRequest]= useState<PendingRequest[]>([])
  const [searching,setSearching]=useState(false)
  const [searchResult,setSearchResult]=useState<UserProfile[]>([])
  const [selectedUser,setSelectedUser]=useState<UserProfile | null>(null)
  const [activeTab,setActivateTab]=useState<"chats" | "requests">("chats")
  const [messages,setMessages]=useState<Message[]>([])
  const [messageInput,setMessageInput]=useState("")

  const fetchPendingRequests =async()=>{
    try{
      const res= await fetch('/api/friends/requests')
      if(res.ok){
        const data= await res.json()
        setPendingRequest(data.requests || [])
      }
    }catch(err){
      alert(`Faild to fetch Pending Request, Error : ${err}`)
    }
  }
 
  const fetchFriends =async()=>{
    try{
      const res= await fetch('/api/friends')
      if(res.ok){
        const data=await res.json()
        console.log("data",data)
        setFriends(data.friends || [])
      }
    }catch(err){
      console.log("error fetching friends:",err)
    }
  }

  const handleSendMessage= async()=>{
    try{
      const res= await fetch('/api/messages',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        receiverId: selectedUser?.id,
        content:messageInput
      })
    })
    if(res.ok){
      const data = await res.json()
      setMessages((prev)=>[...prev,data.message])
      setMessageInput("")
    }else{
      alert("Failed to send Message")
    }
    
    }catch(err){
      alert("Error Sending Message")
    }
  }

  

  useEffect(()=>{
    if(!selectedUser){
      setMessages([])
      return
    }

    const fetchMessages= async ()=>{
    try{
      const res= await fetch(`/api/messages?receiverId=${selectedUser.id}`)
      if(res.ok){
        const data= await res.json()
        setMessages(data.messages || [])
      }
    }
    catch(err){
      alert("Failed to load messages")
    }
  }

  fetchMessages()
  },[selectedUser])

  useEffect(()=>{
    if(session?.user){
      fetchFriends()
      fetchPendingRequests()
    }
  },[session])
  
  useEffect(()=>{
    if(!searchquery.trim()){
      setSearchResult([])
      return
    }

    const timer = setTimeout(async()=>{
      setSearching(true)
      try{
        const res= await fetch(`/api/users/search?q=${encodeURIComponent(searchquery)}`)
        if(res.ok){
          const data = await res.json()
          setSearchResult(data.users || [])
        }
      }catch(err){
        alert(`Search Error${err}`)
      }
    },300)
    return ()=>clearTimeout(timer)
  },[searchquery])

  const handleSendRequest = async(receiverId:number)=>{
    try{
      const res= await fetch('/api/friends/request',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({receiverId})
      })
      const data= await res.json()
      if(res.ok){
        alert("Friend Request Sent")
        setSearchQuery("")
      }else{
        alert("Failed to send Request")
      }
    }catch(err){
      alert("Error Sending Friend Request")
    }
  }

  const handleRespondRequest=async (requestId:string,action:"ACCEPTED" | "REJECTED")=>{
    try{
      const res = await fetch("/api/friends/request", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId, action })
        });
        if(res.ok){
          fetchPendingRequests()
          fetchFriends()
        }
        else{
          const data= await res.json()
          alert("Failed to update request")
        }
    }catch(err){
      alert("Error Updating friendRequest")
    }
  }

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
        <input type='search' 
        placeholder="Search User" 
        onChange={(e)=>setSearchQuery(e.target.value)}
        value={searchquery}
        />
        {searchquery.trim() && (
          <div>
            <span>Search Result:</span>
            {searching?(<p>Searching ......</p>) : searchResult.length === 0 ?(<p>No User Found</p>):(searchResult.map((user)=>(<div key={user.id}>
              <span>{user.username}</span>
              <button onClick={()=>handleSendRequest(user.id)} >Add Friend</button>
            </div>)))}
          </div>
        )}
        <div>
          <button onClick={()=>setActivateTab("chats")}>Friends({friends.length})</button>
          <button onClick={()=>setActivateTab("requests")}>Requests({pendingRequest.length})</button>
        </div>
        <div>{activeTab ==="chats" ? (friends.length === 0 ? (<p>No Friend Yet </p>):(
          friends.map((friend)=>(
            <div key={friend.id} onClick={()=>setSelectedUser(friend)}>
              <div>{friend.username}</div>
              <div>{friend.email}</div>
            </div>
          ))
        )):(
          pendingRequest.length === 0 ?(<p>No Pending Friend Requests</p>):(
            pendingRequest.map((req)=>(
              <div key={req.id}>
                <span>{req.sender.username} wants to connect</span>
              <div>
                <button onClick={()=>handleRespondRequest(req.id,"ACCEPTED")}>Accept</button>
                <button onClick={()=>handleRespondRequest(req.id,"REJECTED")}>Rejected</button>
              </div>

              </div>
              
            ))
          )
        )}</div>
      </div>
      
      <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-slate-800 bg-slate-900/20 text-sm font-medium text-slate-300">
            <div>
              {selectedUser ? (
                <span>Chatting with : {selectedUser.username}({selectedUser.email})</span>
              ):(<span>Select a friend to start Chatting</span>)}
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto text-slate-400">
            <div>
              {selectedUser ? (
                messages.length === 0 ?(
                  <p>No Messages yet with {selectedUser.username}</p>
                ):(
                  <div>
                    {messages.map((m)=>(
                      <div key={m.id}>
                        <span>{m.senderId === Number(session?.user.id)? "You": `${selectedUser.username}`}</span>
                        <span>{m.content}</span>
                      </div>
                    ))}
                  </div>
                )
              ):(
                <p>Select a contact to view messages</p>
              )}
            </div>

          </div>
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 px-4 focus-within:border-indigo-500/50">
            <input className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none" 
            placeholder={selectedUser ?`Message ${selectedUser.username}...`: "select a friend to chat"} 
            disabled={!selectedUser} 
            value={messageInput}
            onChange={(e)=>setMessageInput(e.target.value)}
            onKeyDown={(e)=>e.key === "Enter" && handleSendMessage()}
            />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors" 
            disabled={!selectedUser}
            onClick={handleSendMessage}
            ><h1>Send</h1></button>
          </div>
        </div>
      </div>
    </div>
  );
}
