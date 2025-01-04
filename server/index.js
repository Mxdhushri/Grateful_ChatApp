import express from "express"
import dotenv from "dotenv"
import cors from "cors"//cross origin resource sharing
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactsRoutes from "./routes/ContactRoutes.js"
import messagesRoutes from "./routes/MessagesRoutes.js"
import channelRoutes from "./routes/ChannelRoutes.js";
import setupSocket from "./socket.js"
import paymentsRoutes from "./routes/PaymentsRoutes.js"

dotenv.config() //All the environment varibles in env file will be inside process.env 

const app = express() //REST object
const port = process.env.PORT || 8000
const databaseURL = process.env.DATABASE_URL

app.use(
    cors({
    origin: [process.env.ORIGIN], //from where we get request. As origin in env file has vite ka port
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], //rest api methods like getting data, submitting data, delete data etc 
    credentials: true, //to enable cookies
})
)

app.use("/uploads/profiles", express.static("uploads/profiles"))// day 10- we tell express server that if user comes to this route and uploads image then we serve asset from directory to request
app.use("/uploads/files", express.static("uploads/files"))

app.use(cookieParser()) // request,body,response 
app.use(express.json()) //inbuilt middleware .ensures that body is in json format

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/payments", paymentsRoutes); // and import from routes
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running at http://http:localhost:${port}`)
})

setupSocket(server)// above server function

mongoose
.connect(databaseURL)
.then(() => {
    console.log("database connection successful")
})
.catch((err) => {
    console.log(err.message);
})
