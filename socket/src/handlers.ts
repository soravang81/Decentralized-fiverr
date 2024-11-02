import { Socket } from "socket.io"
import { getSocketId, getTimeDifference } from "../lib/functions";
import { Sockets, editSocket, getStatus, status } from "./socket/user-socket"

interface requests{
  // sender : string;
  senderId : string
  receiver : string;
}
export interface msgprop{
  message : string;
  sid : string;
  rid : string;
  time : Date,
  seen : boolean
}
interface msgseen  {
  sid : string ,
  rid : string ,
  seen : boolean
}
interface statuss {
  senderId : string
  status : status
  clientId : string
}

export const statusHandler = async (socket : Socket , data : statuss) =>{
  console.log("editing status",data)
  await editSocket(data.senderId , data.status , data.clientId)
  console.log(Sockets)
}

export const joinRoomHandler = ( socket: Socket ,data:any ): void => {
  if(data.roomId){
    socket.join(data.roomId)
    console.log("User joined room:", data.roomId);
  }
};

export const leaveRoomHandler = (socket: Socket, data: { room : string }): void => {
  socket.leave(data.room);
  console.log("User left room:", data.room);
};
