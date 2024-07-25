import Chess from "chess.js";
import React, { useState } from "react";
import { Chessboard } from "react-chessboard";

function Game() {
	const [game, setGame] = useState(new Chess());

	const handleMove = (sourceSquare, targetSquare) => {
		const move = {
			from: sourceSquare,
			to: targetSquare,
			promotion: "q", // Always promote to a queen for simplicity
		};

		// Validate the move
		const moveResult = game.move(move);
		if (moveResult === null) return false; // Invalid move

		setGame(new Chess(game.fen())); // Update the game state
		return true;
	};

	const handlePieceClick = (piece, square) => {
		console.log(`Piece clicked: ${piece} on square ${square}`);
	};

	const handleSquareClick = (square) => {
		console.log(`Square clicked: ${square}`);
	};

	return (
		<div>
			<Chessboard
				id='Chessboard'
				position={game.fen()}
				onPieceDrop={handleMove}
				onPieceClick={handlePieceClick}
				onSquareClick={handleSquareClick}
				boardWidth={600}
				animationDuration={300}
				arePiecesDraggable={true}
				boardOrientation='white'
				customBoardStyle={{
					borderRadius: "10px",
					boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
				}}
				customDarkSquareStyle={{ backgroundColor: "#B58863" }}
				customLightSquareStyle={{ backgroundColor: "#F0D9B5" }}
				showBoardNotation={true}
			/>
		</div>
	);
}

export default Game;
