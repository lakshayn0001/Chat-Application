import React from 'react'
import './App.css'

const users=[
  {username:'lakshay',message:'hi there'},
  {username:'lakshay',message:'hi there'},
]

const data=[
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'},
  {userdata:'hello',senderdata:'bdiya bhai'}
]

const App=()=>{
  return(
    <div className='Applicationdiv'>
      <div className='chat_option'>
        
          {users.map((value,index)=>(
            <div id='users'>
              <h1>{value.username}</h1>
            </div>
        ))}
            
        </div>
      <div className='chatarea'>
        <div id='chatmessages_area'>
          
            {data.map((value,index)=>
              <div id='user_message'>{value.userdata}</div>
            )}
            {data.map((value,index)=>
              <div id='sender_message'>{value.senderdata}</div>
            )}
          
        </div>
        <div id='message_area'>
          <div id='attaches'>attachs</div>
          <textarea id='text_area' placeholder='write your text here'/>
          <div id='send'>Send</div>
        </div>
      </div>
      </div>
  )
}

export default App;