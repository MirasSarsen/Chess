const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const rooms = {};

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use(express.json()); // для POST-запросов с JSON

// ===== Chess Lobby =====
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "lobby.html"));
});

// ===== API для редактирования JSON =====
app.get("/api/content/:page", (req, res) => {
    const filePath = path.join(__dirname, "content", `${req.params.page}.json`);
    if (!fs.existsSync(filePath)) return res.status(404).send("Not found");

    const data = fs.readFileSync(filePath, "utf8") || "{}";
    res.json(JSON.parse(data));
});

app.post("/api/content/:page", (req, res) => {
    const filePath = path.join(__dirname, "content", `${req.params.page}.json`);
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});

// ===== Socket.IO (шахматы) =====
io.on("connection", socket => {
    console.log("Player connected:", socket.id);

    socket.on("createRoom", room => {
        socket.join(room);
        rooms[room] = [socket.id];
        socket.emit("assignColor", "white");
        console.log(`${socket.id} created room ${room}`);
    });

    socket.on("joinRoom", room => {
        if (!rooms[room] || rooms[room].length >= 2) {
            socket.emit("roomFull");
            return;
        }
        socket.join(room);
        rooms[room].push(socket.id);
        socket.emit("assignColor", "black");
        io.to(room).emit("bothReady");
        console.log(`${socket.id} joined room ${room}`);
    });

    socket.on("move", ({ room, from, to }) => {
        socket.to(room).emit("opponentMove", { from, to });
    });

    socket.on("disconnecting", () => {
        for (const room of socket.rooms) {
            if (rooms[room]) {
                rooms[room] = rooms[room].filter(id => id !== socket.id);
                if (rooms[room].length === 0) delete rooms[room];
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
    });
});

// ===== Запуск =====
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
