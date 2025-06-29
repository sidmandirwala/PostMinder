import { Server } from "socket.io";

export const ServerSocket = (server, payload) => {
  const io = new Server(server, {
    cors: {
      origin: ["https://localhost:5173", "https://localhost:3001"],
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    socket.emit("scheduled_posts_changes", { payload });
  });
};
