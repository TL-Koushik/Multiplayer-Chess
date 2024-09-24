const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { Chess } = require("chess.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

app.use(cors());
app.use(express.json());

const games = {};

const createGame = (userid,name) => {
	const gameId = Math.random().toString(36).substr(2, 9);
	games[gameId] = {
		board: new Chess(),
		player1Id: userid,
		player1Name:name,
		player2Id: null,
		player2Name:null,
	};
	console.log("game created" + games[gameId].player1Id);
	return gameId;
};

const getGame = (gameId) => games[gameId];

app.get("/api/gamecheck/:gameId/", (req, res) => {
	const { gameId } = req.params;
	const game = getGame(gameId);
	if (game) {
		res.json({
			board: game.board.fen(),
			player1Id: game.player1Id,
			player2Id: game.player2Id,
			player1Name: game.player1Name,
			player2Name: game.player2Name,
		});
	} else {
		res.status(404).json({ error: "Game not found" });
	}
});

app.post("/api/creategame", (req, res) => {
	try {
		const { userid,name } = req.body;
		const gameId = createGame(userid,name);
		res.json({ gameId });
	} catch (error) {
		console.error("Error creating game:", error);
		res.status(500).json({ error: "Failed to create a new game room" });
	}
});

app.post("/api/joingame/:gameId/:playerId/:name", (req, res) => {
	const { gameId, playerId ,name} = req.params;
	let game = getGame(gameId);

	if (!game) {
		return res.status(404).json({ error: "Game not found" });
	}

	if (!game.player2Id) {
		game.player2Id = playerId;
		game.player2Name=name;
	} else if (game.player1Id !== playerId && game.player2Id !== playerId) {
		return res.status(400).json({ error: "Game is full" });
	}

	res.json({
		board: game.board.fen(),
		player1Id: game.player1Id,
		player2Id: game.player2Id,
		player1Name: game.player1Name,
		player2Name:game.player2Name,
	});
});

io.on("connection", (socket) => {
	console.log("New client connected");

	socket.on("joinGame", (gameId) => {
		socket.join(gameId);
		console.log(`Client joined game ${gameId}`);
		if (!games[gameId]) {
			console.log("Game not found");
		}
		// const game = games[gameId];
		const game = games[gameId];

		// const mappedObj = Object.fromEntries(
		// 	Object.entries(game).map(([key, value]) => [key, value * 2])
		// );

		// console.log(mappedObj);
		if (games[gameId].player1Id != null && games[gameId].player2Id != null) {
			io.to(gameId).emit("gameStart", games[gameId]);
			console.log("game started");
		}
	});
	socket.on("msg",({playerId,msg,gameId})=>{
		console.log("recied",msg);
		io.to(gameId).emit("recieveMsg",{playerId,msg});
	});
	socket.on("makeMove", ({ gameId, move, userId }) => {
		let game = games[gameId];
		if (game) {
			try {
				game.board.move(move);
				io.to(gameId).emit("moveMade", { move: game.board.fen(), userId });
				//todo check if the person won or draw and make an entry to the database
			} catch (error) {
				console.error("Invalid move:", error);
				socket.emit("moveError", { error: "Invalid move" });
			}
		}
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
