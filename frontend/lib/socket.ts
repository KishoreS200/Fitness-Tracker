import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      query: { userId },
    })

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server")
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server")
    })

    // Join user's room
    socket.emit("join", userId)
  }

  return socket
}

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.")
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
} 