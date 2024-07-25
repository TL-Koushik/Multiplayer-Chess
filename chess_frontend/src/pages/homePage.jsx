import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import ChessBoardImage from "../assets/chess-board.jpg";
import CommunityImage from "../assets/community.jpg";
import CreateRoomImage from "../assets/create-room.jpg";
import AuthCheckRev from "./AuthCheckRev";

function HomePage() {
	const status = useSelector((state) => state.auth.status);

	return (
		<div>
			<main className='flex-grow flex  items-center'>
				<div className='max-w-4xl mx-auto px-4 py-8'>
					<section className='mb-8'>
						<h1 className='text-3xl font-bold mb-4'>
							Welcome to Multiplayer Chess
						</h1>
						<p className='text-lg'>
							Play chess online with friends or join a community of chess
							enthusiasts from around the world. Experience multiplayer chess
							like never before.
						</p>
					</section>

					<section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div className='bg-gray-700 rounded-lg overflow-hidden transition-transform ease-in-out duration-500 transform hover:scale-105'>
							<img
								src={ChessBoardImage}
								alt='Chess Board'
								className='w-full h-auto'
							/>
							<div className='p-4'>
								<h2 className='text-lg font-semibold mb-2'>Play Chess</h2>
								<p>Join a game or create your own room to play with friends.</p>
							</div>
						</div>
						<div className='bg-gray-700 rounded-lg overflow-hidden transition-transform ease-in-out duration-500 transform hover:scale-105'>
							<img
								src={CreateRoomImage}
								alt='Create Room'
								className='w-full h-auto'
							/>
							<div className='p-4'>
								<h2 className='text-lg font-semibold mb-2'>Create a Room</h2>
								<p>Create a private room, invite friends, and start playing.</p>
							</div>
						</div>
						<div className='bg-gray-700 rounded-lg overflow-hidden transition-transform ease-in-out duration-500 transform hover:scale-105'>
							<img
								src={CommunityImage}
								alt='Community'
								className='w-full h-auto'
							/>
							<div className='p-4'>
								<h2 className='text-lg font-semibold mb-2'>
									Join the Community
								</h2>
								<p>
									Participate in discussions, tournaments, and chess challenges.
								</p>
							</div>
						</div>
					</section>
				</div>
				{!status && <Outlet />} {/* Render Outlet if not authenticated */}
			</main>
		</div>
	);
}

export default HomePage;
