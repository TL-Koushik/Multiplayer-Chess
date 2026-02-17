import React from "react";

function About() {
  return (
    <div className="min-h-[80vh] w-full bg-gray-900 text-white flex justify-center px-4 py-10">

      <div className="max-w-4xl w-full bg-gray-800 shadow-xl rounded-xl p-8 md:p-12">

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          About This Project
        </h1>

        <p className="text-lg leading-relaxed text-gray-300">
          This is a real-time multiplayer chess platform built with modern web
          technologies. Players can create or join rooms, play live games,
          chat with opponents, and experience a smooth interactive interface.
          The application uses WebSockets for real-time communication and
          provides a responsive design that works across devices.
        </p>

        <p className="text-lg leading-relaxed text-gray-300 mt-6">
          The project was developed to demonstrate full-stack skills including
          authentication, state management, real-time game synchronization,
          and modern UI design. It integrates a chess engine for move validation
          and ensures fair gameplay between players.
        </p>

        {/* TECH STACK */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Tech Stack</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>React + Redux</li>
            <li>Socket.IO (Real-time multiplayer)</li>
            <li>Node.js + Express backend</li>
            <li>Chess.js for game logic</li>
            <li>Tailwind CSS for UI</li>
          </ul>
        </div>

        {/* GITHUB LINK */}
        <div className="mt-8 text-center">
          <a
            href="https://github.com/TL-Koushik/Multiplayer-Chess.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            View Source Code on GitHub
          </a>
        </div>

      </div>

    </div>
  );
}

export default About;
