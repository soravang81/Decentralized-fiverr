import SocketManager from '@/lib/socketManager';
import React, { ReactNode, useEffect } from 'react'
import { toast } from 'sonner';

const SocketListeners = ({ children }: { children: ReactNode }) => {

  useEffect(() => {
    const socket = SocketManager.getInstance();
    console.log(socket)
    console.log("Listening messages")

    socket.on("NOTIFICATION_MESSAGE", (data : any) => {
      console.log(data)
      toast.message(data.senderName , {
        description: data.text
      })
    });
    return () => {
      socket.off("NOTIFICATION_MESSAGE");
    }
    
  }, []);

  return <>{children}</>;
}

export default SocketListeners