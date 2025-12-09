import React from "react";

export default function PlayBar({ manager }) {
  return (
    <div className="p-3 border-b flex items-center gap-3 bg-gray-50">
      <button
        onClick={manager.playAll}
        className="bg-green-500 text-white px-3 py-1 rounded shadow"
      >
        ▶️ Play All
      </button>

      <button
        onClick={manager.playSelected}
        className="bg-green-600 text-white px-3 py-1 rounded shadow"
      >
         Play Selected
      </button>

      <button
        onClick={manager.stopAll}
        className="bg-red-500 text-white px-3 py-1 rounded shadow"
      >
        ⏹ Stop
      </button>

      <button
        onClick={manager.addSprite}
        className="bg-blue-200 px-2 py-1 rounded shadow"
      >
        + Sprite
      </button>
    </div>
  );
}
