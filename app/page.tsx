'use client';
import UserDropDown from "@/components/UserDropdown";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {io,Socket} from "socket.io-client" 






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
  const [socket,setSocket]=useState<Socket | null>(null)

  

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

      if(socket&& selectedUser){
        socket.emit("send_message",{
          receiverId:selectedUser.id,
          message: data.message
        })
      }
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
      }finally{
        setSearching(false)
      }
    },300)
    return ()=>clearTimeout(timer)
  },[searchquery])

  useEffect(()=>{
    const socketURL= process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
    const newSocket= io(socketURL)
    setSocket(newSocket)

    newSocket.on("connect",()=>{
      console.log("connected to socket server")
    })

    if(session?.user.id){
      newSocket.emit("join_room",session.user.id)
    }

    return ()=>{
      newSocket.disconnect()
    }
  },[session?.user.id])

  useEffect(()=>{
    if(!socket) return

    const handleReceiverMessage= (incomingMsg:Message)=>{
      if(selectedUser && incomingMsg.senderId === selectedUser.id){
        setMessages((prev)=>[...prev,incomingMsg])
      }
    }
    socket.on("receive_message",handleReceiverMessage)

    return ()=>{
      socket.off("receive_message",handleReceiverMessage)
    }
    },[socket,selectedUser])

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
    <div className="grid grid-cols-[320px_1fr] grid-rows-[64px_1fr] h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      <div className="col-span-2 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-6 font-semibold text-slate-200">
        <UserDropDown user={session?.user} />
        <div id="applicationName" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          ChatMode
        </div>
      </div>

      
      <div className="border-r border-slate-800 bg-slate-900/30 flex flex-col h-full overflow-hidden">
        
        <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/20">
          <input 
            type="search" 
            placeholder="Search username to add..." 
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchquery}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        
        {searchquery.trim() && (
          <div className="p-3 border-b border-slate-800 bg-slate-900/90 max-h-48 overflow-y-auto space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block px-1">Search Results</span>
            {searching ? (
              <p className="text-xs text-slate-500 p-2">Searching...</p>
            ) : searchResult.length === 0 ? (
              <p className="text-xs text-slate-500 p-2">No users found</p>
            ) : (
              searchResult.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm">
                  <span className="font-medium text-slate-200 truncate">{user.username}</span>
                  <button 
                    onClick={() => handleSendRequest(user.id)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Add Friend
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        
        <div className="flex border-b border-slate-800/80 text-xs font-semibold bg-slate-900/40">
          <button 
            onClick={() => setActivateTab("chats")}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === "chats"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Friends ({friends.length})
          </button>
          <button 
            onClick={() => setActivateTab("requests")}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "requests"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Requests
            {pendingRequest.length > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingRequest.length}
              </span>
            )}
          </button>
        </div>

        
        <div className="flex-1 p-3 overflow-y-auto space-y-1">
          {activeTab === "chats" ? (
            friends.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8 px-4 leading-relaxed">
                No friends yet.<br />Search usernames above to add friends!
              </p>
            ) : (
              friends.map((friend) => {
                const isSelected = selectedUser?.id === friend.id;
                return (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedUser(friend)}
                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors border cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500/50 text-white shadow-sm"
                        : "hover:bg-slate-800/50 text-slate-300 border-transparent hover:border-slate-700/40"
                    }`}
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                      {friend.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold text-sm block truncate capitalize">{friend.username}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{friend.email}</span>
                    </div>
                  </button>
                );
              })
            )
          ) : (
            pendingRequest.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No pending friend requests</p>
            ) : (
              pendingRequest.map((req) => (
                <div key={req.id} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2.5">
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-white capitalize">{req.sender.username}</span> wants to connect
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRespondRequest(req.id, "ACCEPTED")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespondRequest(req.id, "REJECTED")}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
      
      
      <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 bg-slate-900/20 text-sm font-medium text-slate-300 flex items-center justify-between">
          {selectedUser ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {selectedUser.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <span className="font-semibold text-white capitalize block">{selectedUser.username}</span>
                <span className="text-xs text-slate-400 block">{selectedUser.email}</span>
              </div>
            </div>
          ) : (
            <span className="text-slate-400">Select a friend to start chatting</span>
          )}
        </div>

       
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {selectedUser ? (
            messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No messages yet with {selectedUser.username}. Send a message below!
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => {
                  const isMe = m.senderId === Number(session?.user?.id);
                  return (
                    <div 
                      key={m.id} 
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] text-slate-500 mb-1 px-1 font-medium">
                        {isMe ? "You" : selectedUser.username}
                      </span>
                      <div 
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-md break-words shadow-sm ${
                          isMe 
                            ? "bg-indigo-600 text-white rounded-br-sm" 
                            : "bg-slate-800/90 text-slate-100 border border-slate-700/50 rounded-bl-sm"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Select a contact from the sidebar to view messages
            </div>
          )}
        </div>

        
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 px-4 focus-within:border-indigo-500/50 transition-colors">
            <input 
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50" 
              placeholder={selectedUser ? `Message ${selectedUser.username}...` : "Select a friend to chat"} 
              disabled={!selectedUser} 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button 
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer" 
              disabled={!selectedUser || !messageInput.trim()}
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
