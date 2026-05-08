const socket = io("ws://localhost:3500")

const nameInput = document.querySelector("#name")
const chatRoom = document.querySelector("#room")
const msgInput = document.querySelector("#message")
const activity = document.querySelector(".activity")
const usersList = document.querySelector(".user-list")
const roomList = document.querySelector(".room-list")
const chatDisplay = document.querySelector(".chat-display")

function enterRoom(e) {
    e.preventDefault()
    if (nameInput.value && chatRoom.value) {
        socket.emit("enterRoom", {
            name: nameInput.value,
            room: chatRoom.value
        })
    }
}

function sendMessage(e) {
    e.preventDefault()
    if (nameInput.value && msgInput.value && chatRoom.value) {
        socket.emit("message", {
            name: nameInput.value,
            text: msgInput.value,
        })
        msgInput.value = ""
    }
    msgInput.focus()
}

document.querySelector(".form-join").addEventListener("submit", enterRoom)
// show typing status
msgInput.addEventListener("keypress", () => {[
    socket.emit("activity", nameInput.value)
]})
document.querySelector(".form-message").addEventListener("submit", sendMessage)

// listen for messages
socket.on("message", (data) => {
    activity.textContent = ""
    const li = document.createElement("li")
    li.textContent = data
    document.querySelector("ul").appendChild(li)
})



// activity event
let activityTimer
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`

    // clear after 3 seconds
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
})