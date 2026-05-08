const socket = io("https://chat-app-z139.onrender.com")

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
msgInput.addEventListener("keypress", () => {
    socket.emit("activity", nameInput.value)
})
document.querySelector(".form-message").addEventListener("submit", sendMessage)

// listen for messages
socket.on("message", (data) => {
    activity.textContent = ""
    const {name, text, time} = data
    const li = document.createElement("li")
    li.className = "post"
    // styling for user message
    if (name === nameInput.value) {
        li.className = "post post--left"
    }
    // styling for other users message
    if (name !== nameInput.value && name !== "Admin") {
        li.className = "post post--right"
    }

    if (name !== "Admin") {
        // html and css for non-admin messages
        li.innerHTML = 
        `
        <div class="post__header ${name === nameInput.value
            ? "post__header--user"
            : "post__header--reply"
        }"
        >
            <span class="post__header--name">${name}</span>        
            <span class="post__header--time">${time}</span>   
        </div>     

        <div class="post__text">${text}</div>
        `
    } else {
        // html and css for admin message
        li.innerHTML = `<div class="post__text">${text}</div>`
    }

    document.querySelector(".chat-display").appendChild(li)
    // for auto scroll
    chatDisplay.scrollTop = chatDisplay.scrollHeight
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

socket.on("userList", ({users}) => {
    showUsers(users)
})

socket.on("roomList", ({rooms}) => {
    showRooms(rooms)
})

function showUsers(users) {
    usersList.textContent = ""
    if (users) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
        users.forEach((user, i) => {
            usersList.textContent += `${user.name}`
            if (users.length > 1 && i !== users.length - 1) {
                usersList.textContent += ","
            }
        })
    }
}

function showRooms(rooms) {
    roomList.textContent = ""
    if (rooms) {
        roomList.innerHTML = "<em>Active Rooms:</em>"
        rooms.forEach((room, i) => {
            roomList.textContent += `${room}`
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ","
            }
        })
    }
}