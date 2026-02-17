import React from "react";
import chessImage from "../assets/chess.png";
import Ai from "./Roomelements/Ai";
import CreateRoom from "./Roomelements/CreateRoom";
import Join from "./Roomelements/Join";

function Room() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col md:flex-row bg-gray-900 text-white">

      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
        <img
          src={chessImage}
          alt="Chess"
          className="w-40 md:w-56 h-auto mb-6"
        />

        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome to the Chess Room
        </h2>

        <p className="text-gray-300 max-w-md">
          Join a game and test your skills against players around the world.
        </p>
      </div>

    <div className="flex-1 flex flex-col justify-center items-center gap-6 p-6 w-full">

  		<CreateRoom />

  		<Join />

  		<Ai />

		</div>

    </div>
  );
}

export default Room;
