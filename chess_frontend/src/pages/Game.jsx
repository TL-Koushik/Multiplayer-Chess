import { Chess } from "chess.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import Spinner from "../Spinner";

const API_URL = "http://localhost:3001"; // Replace with your production API URL

function Game() {
	const [game, setGame] = useState(new Chess());
	const [arrows, setArrows] = useState([]);
	const [boardOrientation, setBoardOrientation] = useState("white");
	const [showPromotionDialog, setShowPromotionDialog] = useState(false);
	const [promotionToSquare, setPromotionToSquare] = useState(null);
	const [loading, setLoading] = useState(true);
	const [socket, setSocket] = useState(null);
	const [canMove, setCanMove] = useState(false);
	const [playerColor, setPlayerColor] = useState(null);
	const chessboardRef = useRef();

	const { gameid: gameId } = useParams();
	const navigate = useNavigate();
	const playerId = useSelector((state) => state.auth.id);
	const isLoggedIn = useSelector((state) => state.auth.status);

	const onDrop = useCallback(
		(sourceSquare, targetSquare) => {
			if (!canMove) return false;

			const gameCopy = new Chess(game.fen());
			let move;

			try {
				move = gameCopy.move({
					from: sourceSquare,
					to: targetSquare,
					promotion: "q", // always promote to queen for simplicity
				});
			} catch (error) {
				return false;
			}

			if (move === null) return false;

			setGame(gameCopy);
			setCanMove(false);
			// Emit the move to the server
			if (socket) {
				socket.emit("makeMove", {
					gameId,
					move: gameCopy.fen(),
					userId: playerId,
				});
			}

			if (gameCopy.isGameOver()) {
				alert(
					gameCopy.isCheckmate()
						? `Checkmate! ${gameCopy.turn() === "w" ? "Black" : "White"} wins!`
						: gameCopy.isDraw()
						? "Game ended in a draw!"
						: "Game over!"
				);
			}

			return true;
		},
		[game, socket, gameId, playerId, canMove]
	);

	const onSquareClick = useCallback(
		(square) => {
			if (!canMove) return;

			const gameCopy = new Chess(game.fen());
			const moves = gameCopy.moves({ square, verbose: true });

			if (moves.length === 0) return;

			setArrows(moves.map((move) => [square, move.to, "green"]));
		},
		[game, canMove]
	);

	const onSquareRightClick = useCallback((square) => {
		setArrows((prevArrows) => {
			const newArrows = [...prevArrows];
			const index = newArrows.findIndex(
				(arrow) => arrow[0] === square && arrow[1] === square
			);
			if (index === -1) {
				newArrows.push([square, square, "red"]);
			} else {
				newArrows.splice(index, 1);
			}
			return newArrows;
		});
	}, []);

	const onPromotionPieceSelect = useCallback(
		(piece) => {
			if (!promotionToSquare) return false;

			const gameCopy = new Chess(game.fen());
			const move = gameCopy.move({
				from: promotionToSquare.slice(0, 2),
				to: promotionToSquare.slice(2),
				promotion: piece[1].toLowerCase(),
			});

			if (move) {
				setGame(gameCopy);
				setShowPromotionDialog(false);
				setPromotionToSquare(null);
				setCanMove(false);

				// Emit the move to the server
				if (socket) {
					socket.emit("makeMove", {
						gameId,
						move: gameCopy.fen(),
						userId: playerId,
					});
				}

				return true;
			}
			return false;
		},
		[game, promotionToSquare, socket, gameId, playerId]
	);

	useEffect(() => {
		const newSocket = io(`${API_URL}`); // Use the production server URL
		setSocket(newSocket);

		newSocket.on("connect", () => {
			console.log("Connected to server");
			newSocket.emit("joinGame", gameId);
		});

		newSocket.on("gameStart", ({ playerColor }) => {
			setPlayerColor(playerColor);
			setBoardOrientation(playerColor);
			setCanMove(playerColor === "white");
			setLoading(false);
		});

		newSocket.on("moveMade", ({ move, userId }) => {
			if (userId !== playerId) {
				setGame(new Chess(move));
				setCanMove(true);
			}
		});

		const fetchGameData = async () => {
			try {
				const response = await fetch(`${API_URL}/api/gamecheck/${gameId}`); // Use the production API URL
				if (!response.ok) {
					throw new Error("Failed to fetch game data");
				}
				return await response.json();
			} catch (error) {
				console.error("Error fetching game data:", error);
				return null;
			}
		};

		const joinGame = async () => {
			try {
				const response = await fetch(
					`${API_URL}/api/joingame/${gameId}/${playerId}`,
					{
						method: "POST",
					}
				);
				if (!response.ok) {
					throw new Error("Failed to join game");
				}
				return await response.json();
			} catch (error) {
				console.error("Error joining game:", error);
				return null;
			}
		};

		const initializeGame = async () => {
			let gameData = await fetchGameData();

			if (!gameData) {
				navigate("/room");
				return;
			}

			const isPlayer1 = playerId === gameData.player1Id;
			if (!isPlayer1 && !gameData.player2Id) {
				gameData = await joinGame();
			}

			if (
				!gameData ||
				(playerId !== gameData.player1Id && playerId !== gameData.player2Id)
			) {
				navigate("/room");
				return;
			}

			setGame(new Chess(gameData.board));

			// Set loading to false after initializing the game
			setLoading(false);
		};

		if (isLoggedIn) {
			initializeGame();
		} else {
			setLoading(false);
		}

		return () => {
			newSocket.disconnect();
		};
	}, [gameId, navigate, playerId, isLoggedIn]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className='flex h-screen justify-between bg-gray-900'>
			<div className='w-3/4 flex flex-col items-center justify-center'>
				<div className='h-96 w-96 rounded-lg overflow-hidden border-black border-2'>
					<Chessboard
						position={game.fen()}
						onPieceDrop={onDrop}
						onSquareClick={onSquareClick}
						onSquareRightClick={onSquareRightClick}
						onPromotionPieceSelect={onPromotionPieceSelect}
						customArrows={arrows}
						boardOrientation={boardOrientation}
						showBoardNotation={true}
						arePiecesDraggable={canMove}
						showPromotionDialog={showPromotionDialog}
						promotionToSquare={promotionToSquare}
						animationDuration={300}
						ref={chessboardRef}
					/>
				</div>
				<div className='mt-4 text-white'>
					{canMove ? "Your turn" : "Opponent's turn"}
				</div>
			</div>
			<div className='w-1/4 bg-gray-800 flex flex-col items-center justify-center rounded-lg'>
				{/* Your Chat Component Here */}
				<div className='text-white text-lg'>Chat Component Placeholder</div>
			</div>
		</div>
	);
}

export default Game;
