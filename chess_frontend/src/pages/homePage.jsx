import React from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import ChessBoardImage from "../assets/chess-board.jpg";
import CommunityImage from "../assets/community.jpg";
import CreateRoomImage from "../assets/create-room.jpg";

function HomePage() {
  const status = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const cards = [
    {
      title: "Play Chess",
      text: "Join a game or create your own room to play with friends.",
      img: ChessBoardImage,
    },
    {
      title: "Create a Room",
      text: "Create a private room, invite friends, and start playing.",
      img: CreateRoomImage,
    },
    {
      title: "Join the Community",
      text: "Participate in discussions, tournaments, and chess challenges.",
      img: CommunityImage,
    },
  ];

  return (
    <div className="min-h-[80vh] w-full flex flex-col justify-center bg-gray-900 text-white">

	{/* Outlet for nested routes if not logged in */}
      {!status && <Outlet />}


      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* HERO */}
        <section className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to Multiplayer Chess
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Play chess online with friends or join players from around the
            world. Experience real-time multiplayer chess like never before.
          </p>
        </section>

        {/* CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate("/room")}
              className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition hover:scale-105 hover:bg-gray-600 text-left"
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
                <p className="text-gray-300">{card.text}</p>
              </div>
            </button>
          ))}
        </section>

      </main>

      
    </div>
  );
}

export default HomePage;
