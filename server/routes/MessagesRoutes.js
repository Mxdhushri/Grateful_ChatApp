import {Router} from "express"
import {verifyToken} from "../middlewares/AuthMiddleware.js"
import {getMessages, uploadFile} from "../controllers/MessagesController.js"
import multer from "multer"

const messagesRoutes = Router()
const upload = multer({dest:"uploads/files"})// dest= destination
messagesRoutes.post("/get-messages" , verifyToken, getMessages)
messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile) //single file upload

export default messagesRoutes