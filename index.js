const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnet", () => {
    socket.broadcast.emit("call ended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    socket.emit("chat message", msg)
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
