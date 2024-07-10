import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

io.on("connection", (Socket) => {
  console.log("userConnected", Socket.id);

  Socket.on("send-location", (data) => {
    io.emit("location-receive", { id: Socket.id, ...data });
  });

  Socket.on("disconnect", () => {
    io.emit("user-disconnected", Socket.id);
    console.log("userDisconnected", Socket.id);
  });
});
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
