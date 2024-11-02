import { statusHandler } from "../handlers";
import { io } from "../server";
import { handleIncomningMessage } from "./handlers";
import { Sockets, handleDisconnect, removeSocket,userSocket } from "./user-socket";

export const SocketConnections = ()=>{
  console.log("socket server starting..")
    io.on("connection", async (socket) => {
        console.log("A user connected:", socket.id);
        // const id = await getUserId(socket.id)
        // console.log(id)
        // io.sockets.sockets.forEach((socket) => {
        //   socket.disconnect(true); // Send a disconnect message to the client
        // });
        
        socket.on("disconnect", async() => {
          await handleDisconnect(socket.id)
          removeSocket(socket.id)
          console.log("A user disconnected:", socket.id);
          console.log(Sockets);
        });

        // socket.on("SEND_REQUEST" , (data)=>sendRequest(socket , data))

        socket.on('SEND_MESSAGE', (data) => handleIncomningMessage(socket, data));

        socket.on('UPDATE_STATUS', (data) => statusHandler(socket, data));
        
        // socket.on("NOTIFICATION", (data) => notificationhandler(socket, data));
        
        // socket.on("USER_DATA", (data) => getUserData(socket, data));

        // socket.on('GET_STATUS', (data) => getStatusHandler(socket, data));

        // socket.on("MSG_SEEN" , (data) => msgSeenHandler(socket, data));

        // socket.on("VIDEO_OFFER_OUT" , (data) => onOffer(socket, data));

        // socket.on("VIDEO_ANSWER_OUT" , (data) => onAnswer(socket, data));

        // socket.on("VIDEO_END" , (data) => onVideoEnd(socket, data));

        // socket.on("VIDEO_NEGOTIATION_END" , (data) => onNegotiationEnd(socket, data));
        
        // socket.on("VIDEO_NEGOTIATION_OUT" , (data) => onNegotiation(socket, data));
                
        // socket.on('JOIN_ROOM', (data) => joinRoomHandler(socket, data));
        
      });
}