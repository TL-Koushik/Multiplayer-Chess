const WebSocket = require("ws");
const { wss, games } = require("./app");

wss.on("connection", (ws) => {
	ws.on("message", (message) => {
		const data = JSON.parse(message);
		const { type, gameId, usrID, move } = data;

		console.log("Received message:", data);

		if (type === "join") {
			if (!games.has(gameId)) {
				games.set(gameId, new Set());
			}
			games.get(gameId).add(usrID);
			// Assign color to the player
			const size = games.get(gameId).size;
			let color = "";
			if (size === 1) color = "white";
			else if (size === 2) color = "black";
			else color = "spectate";
			ws.send(JSON.stringify({ type: "color", color }));
			console.log(`Player joined game ${gameId} as ${color}`);
		}

		if (type === "move") {
			if (games.has(gameId)) {
				games.get(gameId).forEach((player) => {
					if (player !== ws && player.readyState === WebSocket.OPEN) {
						player.send(JSON.stringify({ type: "move", gameId, move }));
					}
				});
				console.log(`Move relayed in game ${gameId}: ${JSON.stringify(move)}`);
			} else {
				console.error(`Attempt to move in non-existent game ${gameId}`);
			}
		}
	});

	ws.on("close", () => {
		games.forEach((players, gameId) => {
			players.delete(ws);
			if (players.size === 0) {
				games.delete(gameId);
				console.log(`Game ${gameId} closed due to no active players`);
			}
		});
	});
});
