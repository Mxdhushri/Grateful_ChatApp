import mongoose from "mongoose"; //Automatically imported and mongoose is library of mongodb

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, //user id [sender id]
        ref: "Users",// prev model user
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId, //user id it is not of string type [recipient id]
        ref: "Users",// prev model user
        required: false
    },
    messageType: {
        type: String,
        enum: ["text", "file"], //user defined datatype(any)
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text"
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType == "file"
        }
    },
    timestamp: {
        type: Date, //inbuilt mongodb attributes and datatype
        default: Date.now,
    }
})

const Message = mongoose.model("Messages", messageSchema)///entire scheema is stored in Messages
export default Message;