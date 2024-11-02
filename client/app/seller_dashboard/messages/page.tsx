"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSellerSideClients } from "../../actions/messaging/client"
import { getSession, useSession } from "next-auth/react"
import { toast } from "sonner"
import { ChatArea } from "@/components/chatarea"
import { getChat } from "@/app/actions/chat/chat"
import { useRecoilState } from "recoil"
import { chatClients, currentClient } from "@/lib/recoil/atoms"
import SocketManager from "@/lib/socketManager"

export type Client = {
  id: string
  isActive? : boolean
  name: string,
  lastMessage: string,
  username : string,
  profilePicture: string
}

export default function Component() {
  const [activeTab, setActiveTab] = useState("active")
  const [selectedClient, setSelectedClient] = useRecoilState<Client | null>(currentClient)
  const [clients , setClients] = useRecoilState<{active: Client[], inactive: Client[]}>(chatClients)
  const [sessionId, setSessionId] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const {data : session , status} = useSession()

  const getData = useCallback(async () => {
    try {
      if(session && status === "authenticated") {
        setSessionId(session.user.id)
        console.log(session)
        setSessionId(session.user.id)
        const fetchedClients: {active: Client[], inactive: Client[]} = await getSellerSideClients()
        console.log(fetchedClients)
        setClients(fetchedClients)
      } else return
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load clients. Please try again.")
    }
  }, [status])

  useEffect(() => {
    getData()
  }, [getData])

  const handleClientSelect = useCallback(async (client: Client) => {
    const socket = SocketManager.getInstance()
    socket.emit("UPDATE_STATUS", { senderId: session?.user.id, status: "ONCHAT" , clientId : client.id});

    setSelectedClient(client)
    setIsSidebarOpen(false)
  }, [])

  return (
    <div className="mt-4 xl:mx-20 lg:mx-16 md:mx-10 sm:mx-4 h-[calc(100vh-86px)] overflow-y-hidden flex flex-col bg-background border rounded-lg">
      <div className="flex-1 flex overflow-hidden">
        <div className={`bg-card w-full md:w-1/3 lg:w-1/4 flex-shrink-0 border-r overflow-hidden ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col p-1">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="past">Past Clients</TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1">
              <TabsContent value="active" className="m-0 space-y-1">
                {clients.active.map((client) => (
                  <div
                    key={client.id}
                    className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                      selectedClient?.id === client.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleClientSelect(client)}
                  >
                    <Avatar>
                      <AvatarImage src={client.profilePicture} alt={client.name} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{client.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{client.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="past" className="m-0 space-y-1">
                {clients.inactive.map((client) => (
                  <div
                    key={client.id}
                    className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                      selectedClient?.id === client.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleClientSelect(client)}
                  >
                    <Avatar>
                      <AvatarImage src={client.profilePicture} alt={client.name} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{client.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{client.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedClient ? (
            <>
            <ChatArea sessionId={sessionId} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/50">
              <p className="text-xl text-muted-foreground">Select a client to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}