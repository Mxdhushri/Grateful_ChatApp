import {Server as socketIOServer} from "socket.io"
import Message from "./models/MessagesModel.js"
import Channel from "./models/ChannelModel.js";

const allowedOrigins = ['https://madhushri-ka-grateful-chat-app.vercel.app/', 'http://localhost:5173'];

const setupSocket = (server) =>{
    const io = new socketIOServer(server,{
        cors: {
            origin: allowedOrigins,
            methods: ["GET" , "POST"],
            credentials:true,
        }
    })

    const userSocketMap = new Map() //users online are stored in map with (userid , socketid)(key , value)

    const disconnect = (socket) =>{ //disconnect from socket
        console.log(`Client Disconnected: ${socket.id}`);
        for(const[userId,socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendMessage = async (message) =>{
        //senders and recepients socket id, we are writing logic for sending message after clicking arrow
        const senderSocketId = userSocketMap.get(message.sender); //from model we get
        const recipientSocketId = userSocketMap.get(message.recipient); //from model recipient imported
        const createdMessage = await Message.create(message) // we get "message" from frontend input
        const messageData = await Message.findById(createdMessage._id).populate("sender", "id eamil firstName lastName image color")
        .populate("recipient", "id eamil firstName lastName image color") //populate means filling of data into sender and recipient
        if(recipientSocketId){
            io.to(recipientSocketId).emit("receiveMessage", messageData) //emit means send
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("receiveMessage", messageData) //emit means send
        }
    }

    const sendChannelMessage = async (message) => {
        const {channelId, sender, content, messageType, fileUrl} = message
        const createdMessage = await Message.create({
          sender,
          recipient: null,
          content,
          messageType,
          timestamp: new Date(),
          fileUrl
        })
    
        const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstName lastName image color").exec()
        await Channel.findByIdAndUpdate(channelId, {
          $push: {messages: createdMessage._id}
        })
    
        const channel = await Channel.findById(channelId).populate("members")
    
        const finalData = {...messageData._doc, channelId: channel._id}
    
        if(channel && channel.members) {
          channel.members.forEach((member) => {
            const memberSocketId = userSocketMap.get(member._id.toString())
            if(memberSocketId) {
              io.to(memberSocketId).emit("receive-channel-message", finalData)
            }
          })
          const adminSocketId = userSocketMap.get(channel.admin._id.toString())
          if(adminSocketId) {
            io.to(adminSocketId).emit("receive-channel-message", finalData)
          }
        }
      }

    io.on("connection", (socket) => { //connect to socket
        const userId = socket.handshake.query.userId; //frontend(sockercontext) se aata hai
        if(userId){
            userSocketMap.set(userId,socket.id)
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`)
        }else{
            console.log("User ID not provided during connection")
        }

        socket.on("sendMessage", sendMessage)
        socket.on("send-channel-message", sendChannelMessage)
        socket.on("disconnect" ,() => disconnect(socket))
    })
}
export default setupSocket; //accessible in server side folders/files