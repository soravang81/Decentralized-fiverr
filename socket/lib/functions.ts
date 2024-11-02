import dotenv from "dotenv"
import { Sockets } from "../src/socket/user-socket"
// import prisma from "../db/db"
dotenv.config()

interface requestProps {
    senderId? : number ,
    receiverId? : number
}

export const getSocketId = async (userId: string): Promise<string | null> => {
    const socket = Sockets.find(s => s.userId === userId);
    console.log(socket?.socketId)
    return socket?.socketId!==undefined ? socket.socketId : null;
};

export const getUserId = async (socketId : string) : Promise<string | false> =>{
    const socket = Sockets.find(s=>s.socketId === socketId)
    console.log("get user id , socket : " , socket)
    return socket?.userId!==undefined ? socket.userId : false
}

export const getTimeDifference = (time: Date | string): string => {
    const timeDate = typeof time === 'string' ? new Date(time) : time;

    const timeDifference = Date.now() - timeDate.getTime();

    const minutes = Math.floor(timeDifference / (1000 * 60));

    if (minutes < 1) {
      return 'now';
    }
    else if (minutes < 5) {
      return 'few mins ago';
    }
    else if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }
    else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)} hr${Math.floor(minutes / 60) > 1 ? 's' : ''} ago`;
    }
    else {
      return `${Math.floor(minutes / 1440)}d${Math.floor(minutes / 1440) > 1 ? 's' : ''} ago`;
    }
  };
