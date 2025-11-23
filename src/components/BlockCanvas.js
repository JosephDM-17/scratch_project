import React, { useCallback } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuid } from "uuid";
import Block from "./block";

export default function BlockCanvas({ manager }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "BLOCK",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const onDrop = useCallback(
    (item) => {
      const id = uuid();
      const [cat, cmd] = item.type.split(":");
      let node;

      if (cat === "motion") {
        if (cmd === "move") node = { id, type: item.type, args: { steps: 10 } };
        if (cmd === "turn") node = { id, type: item.type, args: { deg: 15 } };
        if (cmd === "goto") node = { id, type: item.type, args: { x: 0, y: 0 } };
      }

      if (cat === "looks") {
        if (cmd === "say")
          node = { id, type: item.type, args: { text: "hi", sec: 1 } };
        if (cmd === "think")
          node = { id, type: item.type, args: { text: "hmm", sec: 1 } };
      }

      if (cat === "control" && cmd === "repeat") {
        node = { id, type: item.type, args: { count: 5 }, children: [] };
      }

      manager.addNodeToSelected(node);
    },
    [manager]
  );

  const script = manager.getSelectedScript();

  return (
    <div
      ref={drop}
      className={`flex-1 p-4 h-full overflow-auto ${
        isOver ? "bg-green-50" : ""
      }`}
    >
      <div className="font-bold mb-3">Script Area (Selected Sprite)</div>

      {script?.length === 0 && (
        <div className="text-gray-500 text-sm">Drag blocks here</div>
      )}

      {script?.map((n) => (
        <Block key={n.id} node={n} />
      ))}
    </div>
  );
}
