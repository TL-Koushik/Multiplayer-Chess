import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import conf from "../../../conf";

const API_URL = conf.API_URL;

function Join() {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (roomId.trim().length !== 9) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/gamecheck/${roomId}`);

      if (!response.ok) throw new Error("Room not found");

      const gameData = await response.json();

      if (gameData) {
        navigate(`/room/${roomId}`); // adjust route if needed
      }
    } catch (error) {
      console.error(error);
      alert("Invalid Room ID");
    } finally {
      setLoading(false);
      setRoomId("");
    }
  };

  return (
    <div className="w-full max-w-md flex gap-2 mt-4">

      <input
        type="text"
        placeholder="Enter Room ID"
        className="flex-1 px-4 py-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 px-4 py-2 rounded-md"
      >
        {loading ? "Joining..." : "Join"}
      </button>

    </div>
  );
}

export default Join;
