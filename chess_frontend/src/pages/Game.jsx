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
import { data } from "autoprefixer";
// import Chat from "./chatelementa/Chat";
const API_URL = conf.API_URL;

function Game() {
	const [moveSound] = useSound(capture);
	const [gameResult, setGameResult] = useState(null); // null or { result: 'win' | 'lose' | 'draw', message: string }

	const [game, setGame] = useState(new Chess());
	const [boardOrientation, setBoardOrientation] = useState("white");
	const [loading, setLoading] = useState(true);
	const [socket, setSocket] = useState(null);
	const [playerColor, setPlayerColor] = useState(null);
	const [gameStart, setGameStart] = useState(false);
	const chessboardRef = useRef();
	const [OppnName,setOppnName]=useState("")
	const { gameid: gameId } = useParams();
	const navigate = useNavigate();
	const playerId = useSelector((state) => state.auth.id);
	const isLoggedIn = useSelector((state) => state.auth.status);
	const name = useSelector((state) => state.auth.name);
	const [Msgs,setMsgs]=useState([]);
	const [MsgInput,setMsgInput]=useState("");
	const handleMsgInput=(e)=>{
		if (!MsgInput.trim())return;
		const msg=MsgInput;
		if(socket){
			try{
				socket.emit("msg",{playerId,msg,gameId});
				// console.log("heeee");
				// setMsgs((state)=>[...state,{
				// 	sent:playerId,
				// 	msg:MsgInput,
				// }]);
			}
			catch(error){
				console.log("error sending msges");
			}
		}
		setMsgInput("");
	}
	const onDrop = useCallback(
		(sourceSquare, targetSquare) => {
			if(game.turn()!=playerColor.charAt(0))return false;
			const gameCopy = new Chess(game.fen());
			let move;
			try {
				move = gameCopy.move({
					from: sourceSquare,
					to: targetSquare,
					promotion: "q", // always promote to queen for simplicity
				});
			} catch (error) {
				console.error("Invalid move from : "+sourceSquare+" to : "+targetSquare);
				return false;
			}

			if (move === null) return false;
			setGame(gameCopy);
			moveSound();
			console.log("game turn"+game.turn())
			if (socket) {
				socket.emit("makeMove", {
					gameId,
					move: { from: sourceSquare, to: targetSquare, promotion: "q" },
					userId: playerId,
				});
			}

			gameOver(gameCopy);
			return true;
		},
		[game, socket, gameId, playerId]
	);
	const gameOver = (currentGame) => {
		console.log("called gameover here");
  		if (currentGame.isGameOver()) {
			let result = "";
			let message = "Game over!";

			if (currentGame.isCheckmate()) {
				const winner = currentGame.turn() === "w" ? "Black" : "White";
				message = `Checkmate! ${winner} wins!`;

				const yourColor = playerColor.charAt(0);
				result = winner.toLowerCase().charAt(0) === yourColor ? "win" : "lose";
			} 
			else if (currentGame.isDraw()) {
				message = "Game ended in a draw!";
				result = "draw";
			}
			setGameResult({ result, message });
  		}
};

	useEffect(() => {
		const fetchGameData = async () => {
			try {
				const response = await fetch(`${API_URL}/api/gamecheck/${gameId}`);
				if (!response.ok) {
					throw new Error("Failed to fetch game data");
				}
				const data=await response.json();
				return data;
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
			console.log(Object.entries(gameData));

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
			setOppnName(gameData.player1Id===playerId ? gameData.player2Name : gameData.player1Name)
			setGame(new Chess(gameData.board));
			setLoading(false);
		};
		if (isLoggedIn) {
			initializeGame();
			gameOver(game);
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
			const color = data.player1Id === playerId ? "white" : "black";
			setPlayerColor(color);
			setBoardOrientation(color);
			setLoading(false);
			setGameStart(true);
		});

		newSocket.on("moveMade", ({ fen, userId }) => {
			if (userId !== playerId) {
				setGame(new Chess(fen));
			}
			gameOver(new Chess(fen));
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
  <div className="min-h-[80vh] w-full flex flex-col lg:flex-row bg-gray-900 text-white">

    {/* RESULT MODAL */}
    {gameResult && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {gameResult.result === "win" && "🎉 You Win!"}
            {gameResult.result === "lose" && "😞 You Lose!"}
            {gameResult.result === "draw" && "🤝 It's a Draw!"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {gameResult.message}
          </p>
          <button
            onClick={() => navigate("/room")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
          >
            Back to Room
          </button>
        </div>
      </div>
    )}

    {/* CHESS BOARD SECTION */}
    <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">

      {/* BOARD */}
      <div className="w-full max-w-lg aspect-square border-2 border-black rounded-lg shadow-lg">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={boardOrientation}
          showBoardNotation
          arePiecesDraggable={true}
          animationDuration={300}
          ref={chessboardRef}
        />
      </div>

      {/* TURN INDICATOR */}
      <div
        className={`px-5 py-3 rounded-xl shadow-lg text-lg font-semibold flex items-center gap-3 transition
        ${
          gameStart
            ? game.turn() === playerColor?.charAt(0)
              ? "bg-green-600"
              : "bg-yellow-600"
            : "bg-gray-600"
        }`}
      >
        {gameStart ? (
          game.turn() === playerColor?.charAt(0) ? (
            <>♟️ Your Turn ({playerColor})</>
          ) : (
            <>⏳ Opponent's Turn</>
          )
        ) : (
          <>🎮 Waiting for opponent...</>
        )}
      </div>

    </div>

    {/* CHAT SECTION */}
    <div className="w-full lg:w-96 flex flex-col bg-gray-800 p-4">

      <div className="flex flex-col flex-1 bg-white dark:bg-zinc-800 shadow-md rounded-lg overflow-hidden">

        {/* CHAT HEADER */}
        <div className="px-4 py-3 border-b dark:border-zinc-700 flex justify-between">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
            {OppnName}
          </h2>
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Online
          </span>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2">
          {Msgs.map((msgObj, index) =>
            msgObj.sent === playerId ? (
              <Msgsent key={index} msg={msgObj.msg} />
            ) : (
              <Msgrec key={index} msg={msgObj.msg} />
            )
          )}
        </div>

        {/* INPUT */}
        <div className="px-3 py-2 border-t dark:border-zinc-700 flex gap-2">
          <input
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white text-sm"
            type="text"
            value={MsgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleMsgInput()}
          />
          <button
            onClick={handleMsgInput}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </div>

  </div>
);

}

export default Game;
