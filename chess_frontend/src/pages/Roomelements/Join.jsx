import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import conf from "../../../conf";
const API_URL = conf.API_URL;
function Join() {
	const [roomId, setroomId] = useState("");
	const navigate = useNavigate();
	function handleSubmit() {
		if (roomId.length != 9) return;
		const fetchGameData = async () => {
			try {
				const response = await fetch(`${API_URL}/api/gamecheck/${roomId}`);
				if (!response.ok) {
					throw new Error("Failed to fetch game data");
				}
				return await response.json();
			} catch (error) {
				console.error("Error fetching game data:", error);
				return null;
			}
		};
		if (fetchGameData()) navigate(`${roomId}`);
		setroomId("");
	}
	return (
		<div className='flex justify-center mt-4'>
			<input
				type='text'
				className='w-full h-full m-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400'
				value={roomId}
				onChange={(e) => {
					setroomId(e.target.value);
				}}
			/>
			<button
				className='p-3  m-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
				onClick={handleSubmit}
			>
				Join
			</button>
		</div>
	);
}

export default Join;
