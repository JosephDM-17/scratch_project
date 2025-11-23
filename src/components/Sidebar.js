
import React from "react";
import { useDrag } from "react-dnd";

const BlockPreview = ({ type, label }) => {
  const [, drag] = useDrag(() => ({ type: "BLOCK", item: { type } }));

  const color =
    type.startsWith("motion")
      ? "bg-blue-500"
      : type.startsWith("looks")
      ? "bg-indigo-500"
      : type.startsWith("control")
      ? "bg-yellow-500"
      : "bg-gray-500";

  return (
    <div
      ref={drag}
      className={`${color} text-white px-2 py-1 my-2 text-sm cursor-move rounded`}
    >
      {label}
    </div>
  );
};

export default function Sidebar() {
  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-4 border-r border-gray-200">
      <div className="font-bold">Events</div>
      <div className="my-2 text-sm text-gray-600">(Green flag starts scripts)</div>

      <div className="font-bold mt-4">Motion</div>
      <BlockPreview type="motion:move" label="Move 10 steps" />
      <BlockPreview type="motion:turn" label="Turn 15 degrees" />
      <BlockPreview type="motion:goto" label="Go to x: 0 y: 0" />

      <div className="font-bold mt-4">Control</div>
      <BlockPreview type="control:repeat" label="Repeat 5" />

      <div className="font-bold mt-4">Looks</div>
      <BlockPreview type="looks:say" label="Say Hello for 1s" />
      <BlockPreview type="looks:think" label="Think Hmm for 1s" />
    </div>
  );
}
