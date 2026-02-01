import React from 'react'
import './App.css'

const users = [
  { username: 'lakshay' },
  { username: 'rohit' }
]

const data = [
  { from: 'user', text: 'hello' },
  { from: 'sender', text: 'bdiya bhai' },
  { from: 'user', text: 'kaise ho?' },
  { from: 'sender', text: 'mast 😄' },
]

const App = () => {
  return (
    <div className="Applicationdiv">
      <div className="chat_option">
        {users.map((value, index) => (
          <div className="users" key={index}>
            <h3>{value.username}</h3>
          </div>
        ))}
      </div>
      <div className="chatarea">

        <div className="chatmessages_area">
          {data.map((msg, index) => (
            <div
              key={index}
              className={msg.from === 'user' ? 'user_message' : 'sender_message'}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="message_area">
          <div className="attaches">📎</div>
          <textarea className="text_area" placeholder="write your text here" />
          <div className="send">Send</div>
        </div>
      </div>
    </div>
  )
}

export default App
