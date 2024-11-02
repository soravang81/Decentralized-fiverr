import { Request, Router } from "express";
import { app, io, startServer, url } from "./server";
import { Sockets, userSocket } from "./socket/user-socket";
import { SocketConnections } from "./socket/socket";

// start the server
const start = async () => {
  await startServer();
  SocketConnections();
}

start();

//routes  
io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  userSocket(socket.id , userId)
  console.log(Sockets)
  next();
});

app.get("/", (req, res) => {
  res.send("hello world");
  console.log(`Frontend URL: ${url}`);
});






