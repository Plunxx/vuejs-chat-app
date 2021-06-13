const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const humanizeDuration = require('humanize-duration');
const port = 3000;

http.listen(port,function() { console.log("Sunucu hazır!")});

app.get("/", async(req,res) => {
    res.sendFile(__dirname+'/public/index.html')
})

let usernames = [];
let messages = [];

io.on('connection', socket => {
  socket.on("user", async(user) => {
     await usernames.push(user.username);
     io.emit("users", usernames);
  })

  socket.on("message", async(message) => {
      await messages.push({
          author: message.author,
          message: message.message
      });
      io.emit("messages", messages);
  })

  socket.on("disconnect", async() => {
    socket.on("user", async(user) => {
        await usernames.push(user.username);
        io.emit("users", usernames);
     })
  })
});

