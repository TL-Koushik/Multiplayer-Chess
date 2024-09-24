import { Chess } from "chess.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import useSound from "use-sound";
import conf from "../../conf";
import capture from "../assets/capture.mp3";
import Spinner from "../Spinner";
import Msgsent from "./chatelementa/Msgsent";
import Msgrec from "./chatelementa/Msgrec";
import { LogIn } from "lucide-react";
// import Chat from "./chatelementa/Chat";
import { v4 as uuid } from 'uuid';
const API_URL = conf.API_URL;

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
	const [OppnName,setOppnName]=useState("")
	const { gameid: gameId } = useParams();
	const navigate = useNavigate();
	const playerId = useSelector((state) => state.auth.id);
	const isLoggedIn = useSelector((state) => state.auth.status);
	const name = useSelector((state) => state.auth.name);
	const [Msgs,setMsgs]=useState([{
		sent:null,
		msg:null,
	}]);
	const [MsgInput,setMsgInput]=useState("");
	const handleMsgInput=(e)=>{
		if (!MsgInput.trim())return;
		const msg=MsgInput;
		if(socket){
			try{
				socket.emit("msg",{playerId,msg,gameId});
				console.log("heeee");
				// setMsgs((state)=>[...state,{
				// 	sent:playerId,
				// 	msg:MsgInput,
				// }]);
			}
			catch(errot){
				console.log("error sending msges");
			}
		}
		setMsgInput("");
	}
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
		console.log(name);
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
					`${API_URL}/api/joingame/${gameId}/${playerId}/${name}`,
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
			setOppnName(gameData.player1Id===playerId ? gameData.player2Name : gameData.player1Name)
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
		newSocket.on("recieveMsg",({playerId,msg})=>{
			setMsgs((state)=>[...state,{
				sent:playerId,
				msg:msg,
			}]);
		})
		return () => {
			newSocket.disconnect();
		};
	}, [gameId, navigate, playerId, playerColor, isLoggedIn]);

	if (loading) {
		return <Spinner />;
	}
	return (
		<div className='flex h-screen justify-between bg-gray-900'>
			<div className='w-2/4 flex flex-col items-center justify-center'>
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
				{/* <div>{Name}</div> */}
			</div>
			<div className='w-1/4 bg-gray-800 flex flex-col items-center justify-center rounded-lg'>
				{/* <div className='text-white text-lg'>Chat Component Placeholder</div> */}
				
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 shadow-md rounded-lg overflow-hidden">
      <div className="flex flex-col h-[400px]">
        <div className="px-4 py-3 border-b dark:border-zinc-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
              {OppnName}
            </h2>
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Online
            </div>
          </div>
        </div>
        <div
          className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2"
          id="chatDisplay"
        >
			{Msgs.map((msgObj)=>{
				if(msgObj.sent==playerId)return <Msgsent key={uuid()}msg={msgObj.msg}/>;
				return <Msgrec key={uuid()} msg={msgObj.msg}/>;
			})}
        </div>
        <div className="px-3 py-2 border-t dark:border-zinc-700">
          <div className="flex gap-2">
            <input
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm"
              id="chatInput"
              type="text"
			  value={MsgInput}
			  onChange={(e)=>{setMsgInput(e.target.value)}}
			  onKeyDown={(e) => {
				if (e.key === "Enter")
					handleMsgInput();
				}}
            />
			
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
              id="sendButton"
			  onClick={handleMsgInput}
			  
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
			</div>	
		</div>
	);
}

export default Game;
