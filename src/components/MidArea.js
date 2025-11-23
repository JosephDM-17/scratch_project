
import React from "react";
import BlockCanvas from "./blockCanvas";
export default function MidArea({ manager }) {
const sprite = manager.sprites.find(s => s.id === manager.selectedId);

  return (
    <div className="flex-1 h-full overflow-auto border-l border-gray-200">
      <div className="p-4 border-b bg-gray-50 font-bold">
        {sprite ? sprite.name : "No Sprite Selected"}
      </div>

      <BlockCanvas manager={manager} />
    </div>
  );
}
