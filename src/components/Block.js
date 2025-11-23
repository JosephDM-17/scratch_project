import React from "react";

export default function Block({ node }) {
  const label = (() => {
    const [cat, cmd] = node.type.split(":");

    if (cat === "motion") {
      if (cmd === "move") return `move ${node.args.steps} steps`;
      if (cmd === "turn") return `turn ${node.args.deg} degrees`;
      if (cmd === "goto") return `go to ${node.args.x}, ${node.args.y}`;
    }

    if (cat === "looks") {
      if (cmd === "say")
        return `say "${node.args.text}" for ${node.args.sec}s`;
      if (cmd === "think")
        return `think "${node.args.text}" for ${node.args.sec}s`;
    }

    if (cat === "control" && cmd === "repeat") {
      return `repeat ${node.args.count}`;
    }

    return node.type;
  })();

  return (
    <div className="border p-2 my-1 rounded bg-gray-100 shadow-sm">
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
}
