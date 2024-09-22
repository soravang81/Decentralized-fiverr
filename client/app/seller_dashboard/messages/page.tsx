"use client"
import { pusher } from "@/app/actions/messaging/pusher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function Messages () {

    const [messages, setMessages] = useState<{
        sender: string;
        message: string;
        timestamp: string;
    }[]>([]);
    const [newMessage, setNewMessage] = useState("");


    // useEffect(()=>{
    //     pusher.trigger("jane", "new-message", {
    //         msg : "hello world"
    //     })
    // })
    const handleSubmit = (e:any) => {
        e.preventDefault();

        const newMessageObject = {
            sender: "you",
            message: newMessage,
            timestamp: new Date().toLocaleString(),
        };

        setMessages([...messages, newMessageObject]);
        setNewMessage("");
    };
    if(true) return <h1 className="text-3xl font-bold text-center mt-20">Coming Soon...</h1>
    return (
        <div className="container py-20">
            <div className="flex flex-col justify-between">
                <div className=" p-4 rounded-lg bg-white shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">Messages with Jane</h1>
                    <div className="flex flex-col justify-between h-96 overflow-y-scroll">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-4 w-fit ${
                                    message.sender === "you" ? "self-end" : "self-start"
                                }`}
                            >
                                <p className="text-gray-500 mb-2">{message.timestamp}</p>
                                <p
                                    className={`text-lg p-4 rounded-lg ${
                                        message.sender === "you"
                                            ? "bg-blue-200 text-blue-800"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {message.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className=" p-4 rounded-lg bg-white shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <Input
                            className="w-full h-12 p-4 rounded-lg border border-gray-300 mb-4"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button
                            type="submit"
                            className="p-4 bg-blue-500 text-white rounded-lg"
                        >
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
