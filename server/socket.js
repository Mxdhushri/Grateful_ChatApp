import {Server as socketIOServer} from "socket.io"
import Message from "./models/MessagesModel.js"

const setupSocket = (server) =>{
    const io = new socketIOServer(server,{
        cors: {
            origin: process.env.ORIGIN,
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

    io.on("connection", (socket) => { //connect to socket
        const userId = socket.handshake.query.userId; //frontend(sockercontext) se aata hai
        if(userId){
            userSocketMap.set(userId,socket.id)
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`)
        }else{
            console.log("User ID not provided during connection")
        }

        socket.on("sendMessage", sendMessage)

        socket.on("disconnect" ,() => disconnect(socket))
    })
}
export default setupSocket; //accessible in server side folders/files