import { Underline } from "lucide-react";

export const createChatSlice =(set,get) => (
    {
        selectedChatType:undefined, //initially undefined - grp-channel or personal-channel
        selectedChatData:undefined, //intially undefined -person or grp info such as dp
        selectedChatMessages:[],//huge thus array
        directMessagesContacts:[],
        setSelectedChatType:(selectedChatType)  => set({selectedChatType}),
        setSelectedChatData:(selectedChatData)  =>set({selectedChatData}),
        setSelectedChatMessages:(selectedChatMessages) => set({selectedChatMessages}),
        setDirectMessagesContacts:(directMessagesContacts) => set({directMessagesContacts}),

        closeChat:() => set({selectedChatData:undefined, selectedChatType:undefined,
            selectedChatMessages:[], //A's messages are stored after i stop chatting with B and chat with A
        }), // put ,"," to avoid error

        addMessage: (message) =>{
            const selectedChatMessages = get(). selectedChatMessages;
            const selectedChatType = get().setSelectedChatType; //getset in zustand is same sate mangement 
            set({
                selectedChatMessages:[
                    ...selectedChatMessages,{
                        ...message,
                        recipient: selectedChatType ==="channel" ? message.recipient : message.recipient._id,
                        sender: selectedChatType ==="channel" ? message.sender : message.sender._id,
                    }
                ]
            })
        }
    }
)