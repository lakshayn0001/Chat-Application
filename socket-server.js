const {createServer} = require('http')
const {Server}= require('socket.io')
const dotenv= require('dotenv')


dotenv.config()


const httpServer= createServer()

const allowedOrigins= process.env.CLIENT_URL ? [process.env.CLIENT_URL,"http://localhost:3000"]:["http://localhost:3000","*"]

const io= new Server(httpServer,{
    cors:{
        origin:allowedOrigins,
        methods:["GET","POST"]
    }
})

io.on("connection",(socket)=>{
    console.log("New Connection",socket.id)
    socket.on("join_room",(userId)=>{
        if(userId){
            socket.join(String(userId))
        }
    })

    socket.on("send_message",({receiverId,message})=>{
        if(receiverId && message){
            socket.to(String(receiverId)).emit("receive_message",message)
        }
    })

    socket.on("disconnect",()=>{
        console.log("CLient Dissconnected")
    })

})


const PORT= process.env.PORT || 3001

httpServer.listen(PORT,()=>{
    console.log("socket running")
})

