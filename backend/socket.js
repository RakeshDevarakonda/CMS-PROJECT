// socket-server.js
import { Server } from "socket.io";

let io; // Declare io as a variable

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    // Example: emit a welcome event
    socket.emit("welcome", { message: "Welcome to the server!" });
  });

  return io;
};

// Export the io instance to use in controllers
export const getSocketInstance = () => io;
