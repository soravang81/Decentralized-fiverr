
export interface SocketProps {
    socketId?: string,
    userId? : string,
    status : {
        status : status
        id? : string
    }
}
export type status = "AWAY" | "ONCHAT"
export let Sockets:SocketProps[] = [];

export const userSocket = ( socketId:string , userId:string) => {
    const newSockets : SocketProps = {
        socketId: socketId,
        userId: userId,
        status : {
            status : "AWAY",
        }
    };
    Sockets.push(newSockets)
};
export const removeSocket = (id: string)=>{
    if(typeof id === "string"){
        const index = Sockets.findIndex(s => s.socketId === id);
        Sockets.splice(index, 1)[0];
        console.log(Sockets)
    }
    else{
        const index = Sockets.findIndex(s => s.userId === id);
        Sockets.splice(index, 1)[0];
        console.log(Sockets)
    }
}
export const editSocket = async(uid : string , status : status , id? : string ):Promise<boolean> => {
    let resp:boolean = false
    console.log("status handler : " + uid , id , status)
    Sockets.map((socket)=>{
        if(socket.userId === uid){
            try {
                socket.status.status = status;
                id ? socket.status.id = id : delete socket.status.id
                resp= true
            }
            catch(e) {
                console.log(e)
                resp= false
            }
        }
    })
    return resp
}
export const getStatus = async(id : string): Promise<{status : status , id? : string} | false> =>{
    const socket = Sockets.find(s=>s.userId === id);
    if(socket?.status){
        return socket?.status
    }
    else{
        return false
    }
}

export const handleDisconnect =async (id : string) =>{
    //clear all related redis data if this user , firstly 
}

