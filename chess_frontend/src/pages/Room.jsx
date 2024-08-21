// Room.js

import React from "react";
import chessImage from "../assets/chess.png";
import Ai from "./Roomelements/Ai";
import CreateRoom from "./Roomelements/CreateRoom";
import Join from "./Roomelements/Join";

function Room() {
	return (
		<div className='h-screen w-screen flex flex-col md:flex-row bg-gray-900 text-white'>
			{/* Left Section */}
			<div className='md:flex-1 flex flex-col justify-center items-center p-5'>
				<img src={chessImage} alt='Chess' className='w-48 h-auto mb-5' />
				<div className='text-center'>
					<h2 className='text-3xl font-bold mb-2'>Welcome to the Chess Room</h2>
					<p className='text-lg'>
						Join a game and test your skills against others.
					</p>
				</div>
			</div>

			{/* Right Section */}
			<div className='md:flex-1 flex flex-col justify-center items-center gap-6'>
				<div>
					<CreateRoom />
				</div>
				<div>
					<Join />
				</div>
				<div>
					<Ai />
				</div>
			</div>
		</div>
	);
}

export default Room;
