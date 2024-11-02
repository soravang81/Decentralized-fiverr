import { Menu, MoreVertical, Phone, Send, VideoIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { useCallback, useEffect, useRef, useState } from "react"
import { Client } from "@/app/seller_dashboard/messages/page"
import { useRecoilState, useSetRecoilState } from "recoil"
import { chatClients, currentClient, Messages } from "@/lib/recoil/atoms"
import { toast } from "sonner"
import { createChat, getChat } from "@/app/actions/chat/chat"
import SocketManager from "@/lib/socketManager"
import { Message } from "@/lib/types"
import { useSession } from "next-auth/react"

export const ChatArea = ({
    sessionId,
}: {
    sessionId: string
}) => {
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const [selectedClient, setSelectedClient] = useRecoilState<Client | null>(currentClient)
    const setClients = useSetRecoilState(chatClients)
    const { data: session, status } = useSession()
    const [messages, setMessages] = useRecoilState<Message[]>(Messages)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [inputMessage, setInputMessage] = useState("")

    // Create a ref for the scroll area
    const scrollAreaRef = useRef<HTMLDivElement | null>(null)

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim() && selectedClient) {
            const newMessage: Message = {
                id: Date.now().toString(),
                senderId: sessionId,
                receiverId: selectedClient.id,
                text: inputMessage,
                createdAt: new Date(),
            }
            setMessages(prevMessages => [...prevMessages, newMessage])
            setInputMessage("")

            try {
                const latestMessage = await createChat({
                    receiver: selectedClient.id,
                    text: inputMessage
                })

                const socket = SocketManager.getInstance()
                socket.emit("SEND_MESSAGE", {
                    id: newMessage.id,
                    senderId: sessionId,
                    senderName: session?.user.name,
                    receiverId: selectedClient.id,
                    text: inputMessage,
                    createdAt: new Date(),
                })

                if (!latestMessage) {
                    throw new Error("Failed to send message")
                }
                setMessages(prevMessages => 
                    prevMessages.map(msg => 
                        msg.id === newMessage.id ? latestMessage : msg
                    )
                )
                setClients((prevClients: { active: Client[], inactive: Client[] }) => {
                    const updatedClients = prevClients.active.map((client) => {
                        if (client.id === selectedClient.id) {
                            return {
                                ...client,
                                lastMessage: latestMessage.text
                            }
                        }
                        return client
                    })
                    return { active: updatedClients, inactive: prevClients.inactive }
                })
            } catch (error) {
                console.error("Error sending message:", error)
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== newMessage.id))
                toast.error("Failed to send message. Please try again.")
            }
        }
    }

    const fetchChat = async (client: Client) => {
        setSelectedClient(client)
        setIsSidebarOpen(false)
        try {
            const chat = await getChat(client.id)
            console.log(chat)
            setMessages(chat)
        } catch (error) {
            console.error("Error fetching chat:", error)
            toast.error("Failed to load chat messages. Please try again.")
        }
    }

    useEffect(() => {
        if (selectedClient) fetchChat(selectedClient);
        else console.log("no client")

        const socket = SocketManager.getInstance();
        socket.emit("UPDATE_STATUS", { senderId: session?.user.id, status: "ONCHAT", clientId: selectedClient?.id });
        socket.on("RECEIVE_MESSAGE", (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, {
                id: data.id,
                senderId: data.senderId,
                receiverId: data.receiverId,
                text: data.text,
                createdAt: new Date(data.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' }),
            }]);
            console.log("listening")
        });
        return () => {
            socket.off("RECEIVE_MESSAGE");
            socket.emit("UPDATE_STATUS", { senderId: sessionId, status: "AWAY" });
        };
    }, [selectedClient, sessionId]);

    // Scroll to the bottom of the chat area
    const scrollToBottom = (
      container: HTMLDivElement | null,
      smooth = false,
    ) => {
      if (container?.children.length) {
        const lastElement = container?.lastChild as HTMLElement
    
        lastElement?.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'end',
          inline: 'nearest',
        })
      }
    }

    useEffect(() => {
        scrollToBottom(scrollAreaRef.current , true);
    }, [messages]);

    return (
        <>
            <div className="bg-card p-4 flex items-center justify-between border-b">
                <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Avatar>
                        <AvatarImage src={selectedClient?.profilePicture} alt={selectedClient?.name} />
                        <AvatarFallback>{selectedClient?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{selectedClient?.name}</h2>
                </div>
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                        <VideoIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <ScrollArea className="flex-1 p-4" >
                {messages.map((message) => (
                    <div
                        ref={scrollAreaRef}
                        key={message.id}
                        className={`mb-4 ${message.senderId === sessionId ? "text-right" : "text-left"}`}
                    >
                        <div
                            className={`inline-block p-3 rounded-lg ${message.senderId === sessionId
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                        >
                            <p>{message.text}</p>
                            <p className="text-xs mt-1 opacity-70">{message.createdAt.toLocaleString([], { month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ))}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 bg-background border-t flex">
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 mr-2"
                />
                <Button type="submit">
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </>
    )
}
