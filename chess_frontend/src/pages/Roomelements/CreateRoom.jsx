import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
	const navigate = useNavigate();
	const id = useSelector((state) => state.auth.id);

	const handleClick = async () => {
		try {
			const response = await fetch("http://192.168.1.60:3001/api/creategame", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userid: id }),
			});
			console.log("here");
			if (!response.ok) {
				throw new Error("Failed to create a new game room");
			}

			const game = await response.json();
			navigate(`/room/${game.gameId}`);
		} catch (error) {
			console.error("Error creating room:", error);
			// Optionally, you can display an error message to the user here
		}
	};

	return (
		<div className='flex justify-center mt-4'>
			<button
				type='button'
				className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300'
				onClick={handleClick}
			>
				Create Room
			</button>
		</div>
	);
};

export default CreateRoom;
