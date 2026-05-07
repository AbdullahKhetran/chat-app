import express from "express"
import {Server} from "socket.io"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500

const app = express()
 
app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on("connection", socket => {
    console.log(`User ${socket.id} connected`)

    // upon connection - to only user
    socket.emit("message", "Welcome to Chat App!")

    // upon connection - to everyone except user
    socket.broadcast.emit("message", `User ${socket.id.substring(0,5)} connected`)

    // listening for a message event
    socket.on("message", data => {
        console.log(data)
        io.emit("message", `${socket.id.substring(0,5)}: ${data}`)
    })

    // upon disconnection - to everyone except user
    socket.on("disconnect", () => {
        socket.broadcast.emit("message", `User ${socket.id.substring(0,5)} disconnected`)
    })

    // listen for activity
    socket.on("activity", (name) => {
        socket.broadcast.emit("activity", name)
    })
})

