import { Socket } from "socket.io";
import { TIncomingMessage } from "../types";
import { getSocketId } from "../../lib/functions";
import { getStatus } from "./user-socket";

export const handleIncomningMessage = async (socket: Socket , data : TIncomingMessage) => {
    const receiverSocket = await getSocketId(data.receiverId)
    if(!receiverSocket){
        console.error("Receiver socket not found")
        return
    }
    const status = await getStatus(data.receiverId)
    console.log("receiver status" , status)
    if(status && status.status === "ONCHAT" && status.id === data.senderId){
        socket.to(receiverSocket).emit("RECEIVE_MESSAGE",data)
    } else {
        socket.to(receiverSocket).emit("NOTIFICATION_MESSAGE",data)
    }
};