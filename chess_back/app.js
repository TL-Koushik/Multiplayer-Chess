const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Chess } = require("chess.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

const games = new Map();

io.on("connection", (socket) => {
	socket.on("joinGame", ({ gameId, playerId }) => {
		socket.join(gameId);

		if (!games.has(gameId)) {
			games.set(gameId, {
				game: new Chess(),
				players: new Set(),
				spectators: new Set(),
			});
		}

		const gameData = games.get(gameId);

		if (gameData.players.size < 2) {
			gameData.players.add(playerId);
			socket.emit("gameState", gameData.game.fen());
		} else {
			gameData.spectators.add(socket.id);
		}

		io.to(gameId).emit("spectatorCount", gameData.spectators.size);
	});

	socket.on("move", ({ gameId, move }) => {
		const gameData = games.get(gameId);
		if (gameData) {
			gameData.game.load(move);
			io.to(gameId).emit("gameState", gameData.game.fen());
		}
	});

	socket.on("disconnect", () => {
		games.forEach((gameData, gameId) => {
			if (gameData.spectators.delete(socket.id)) {
				io.to(gameId).emit("spectatorCount", gameData.spectators.size);
			}
		});
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
