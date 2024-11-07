"use client";

import Loader from '@/components/loader';
import SocketManager from '@/lib/socketManager';
import { set } from '@project-serum/anchor/dist/cjs/utils/features';
import { getSession } from 'next-auth/react';
import React, { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

const SocketWrapper = ({ children }: { children: ReactNode }) => {
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      const session = await getSession();

      if (session && session.user?.id) {
        const currentUserId = SocketManager.getInstance().getCurrentUserId();

        if (!SocketManager.getInstance().isConnected() || currentUserId !== session.user.id) {
          console.log("Connecting with User ID:", session.user.id);
          try {
            await SocketManager.getInstance().connect(SOCKET_URL, session.user.id);
            setIsConnected(true);
            console.log("Connected successfully");
          } catch (error) {
            console.error("Connection error:", error);
            toast.error("Failed to connect to the socket.");
          }
        } else {
          console.log("Already connected with User ID:", currentUserId);
          setIsConnected(true); // Update state if already connected
        }
      } else {
        console.log("No session found, disconnecting socket");
        if (SocketManager.getInstance().isConnected()) {
          SocketManager.getInstance().disconnect();
          setIsConnected(false);
        }
        setIsConnected(true);
      }
    };

    connectSocket();

    // Cleanup on unmount
    return () => {
      if (SocketManager.getInstance().isConnected()) {
        console.log("Disconnecting socket on unmount");
        SocketManager.getInstance().disconnect();
        setIsConnected(false);
      }
    };
  }, []);

  return (
    <>
      {isConnected ? children : <Loader/>}
    </>
  );
};

export default SocketWrapper;
