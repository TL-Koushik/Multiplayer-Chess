import { Chess } from "chess.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import useSound from "use-sound";
import capture from "../assets/capture.mp3";
import Spinner from "../Spinner";
const API_URL = "http://192.168.1.60:3001";

function Game() {
	const [moveSound] = useSound(capture);
	const [game, setGame] = useState(new Chess());
	const [boardOrientation, setBoardOrientation] = useState("white");
	const [loading, setLoading] = useState(true);
	const [socket, setSocket] = useState(null);
	const [canMove, setCanMove] = useState(false);
	const [playerColor, setPlayerColor] = useState(null);
	const [gameStart, setGameStart] = useState(false);
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
				console.error("Invalid move:", error);
				return false;
			}

			if (move === null) return false;
			setGame(gameCopy);
			moveSound();
			setCanMove(false);

			if (socket) {
				socket.emit("makeMove", {
					gameId,
					move: { from: sourceSquare, to: targetSquare, promotion: "q" },
					userId: playerId,
				});
			}

			if (gameCopy.isGameOver()) {
				let message = "Game over!";
				if (gameCopy.isCheckmate()) {
					message = `Checkmate! ${
						gameCopy.turn() === "w" ? "Black" : "White"
					} wins!`;
				} else if (gameCopy.isDraw()) {
					message = "Game ended in a draw!";
				}
				alert(message);
				navigate("/room");
			}

			return true;
		},
		[game, socket, gameId, playerId, canMove]
	);

	useEffect(() => {
		const fetchGameData = async () => {
			try {
				const response = await fetch(`${API_URL}/api/gamecheck/${gameId}`);
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
			console.log(gameData);

			if (
				!gameData ||
				(playerId !== gameData.player1Id && playerId !== gameData.player2Id)
			) {
				navigate("/room");
				return;
			}

			setGame(new Chess(gameData.board));
			setLoading(false);
		};
		if (isLoggedIn) {
			initializeGame();
		} else {
			setLoading(false);
		}
		const newSocket = io(API_URL);
		setSocket(newSocket);

		newSocket.on("connect", () => {
			console.log("Connected to server");
			newSocket.emit("joinGame", gameId);
		});

		newSocket.on("gameStart", (data) => {
			// const d = await data.json();

			// console.log(data.player1Id === playerId ? "white" : "black");
			setLoading(true);
			setPlayerColor(data.player1Id === playerId ? "white" : "black");
			setBoardOrientation(playerColor);
			setCanMove(playerColor === "white");
			setLoading(false);
			setGameStart(true);
		});

		newSocket.on("moveMade", ({ move, userId }) => {
			if (userId !== playerId) {
				setGame(new Chess(move));
				setCanMove(true);
			}
		});

		return () => {
			newSocket.disconnect();
		};
	}, [gameId, navigate, playerId, playerColor, isLoggedIn]);

	if (loading) {
		return <Spinner />;
	}
	return (
		<div className='flex h-screen justify-between bg-gray-900'>
			<div className='w-3/4 flex flex-col items-center justify-center'>
				<div className='h-96 w-96 rounded-lg border-black border-2'>
					<Chessboard
						position={game.fen()}
						onPieceDrop={onDrop}
						boardOrientation={boardOrientation}
						showBoardNotation={true}
						arePiecesDraggable={canMove}
						animationDuration={300}
						ref={chessboardRef}
					/>
				</div>
				<div className='mt-4 text-white'>
					{gameStart
						? canMove
							? "Your turn"
							: "Opponent's turn"
						: "Game Not Yet Started"}
				</div>
			</div>
			<div className='w-1/4 bg-gray-800 flex flex-col items-center justify-center rounded-lg'>
				<div className='text-white text-lg'>Chat Component Placeholder</div>
				{/* https://magicui.design/docs/components/animated-list here use this component and send and receive the messages from the chat*/}
			</div>
		</div>
	);
}

export default Game;
