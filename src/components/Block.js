import React from "react";
import { useDrop } from "react-dnd";

export default function Block({ node, manager }) {
  const [, drop] = useDrop({
    accept: "BLOCK",
    canDrop: () => node.type === "control:repeat",
    drop: (item, monitor) => {
        if (monitor.didDrop()) return; // already handled by inner
        manager.addNodeToRepeat(node.id, item);
    },
  });

  const handleChange = (e, key) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    manager.updateNode(node.id, { [key]: val });
  };

  const renderContent = () => {
    const [cat, cmd] = node.type.split(":");

    if (cat === "motion") {
      if (cmd === "move") {
        return (
          <span className="flex items-center gap-2">
            Move 
            <input 
               type="number" 
               value={node.args.steps} 
               onChange={(e) => handleChange(e, "steps")} 
               className="w-12 px-1 border rounded text-black font-normal"
            />
            steps
          </span>
        );
      }
      if (cmd === "turn") {
         return (
          <span className="flex items-center gap-2">
            Turn 
            <input 
               type="number" 
               value={node.args.deg} 
               onChange={(e) => handleChange(e, "deg")} 
               className="w-12 px-1 border rounded text-black font-normal"
            />
            degrees
          </span>
        );
      }
      if (cmd === "goto") {
         return (
          <span className="flex items-center gap-2">
            Go to x:
             <input 
               type="number" 
               value={node.args.x} 
               onChange={(e) => handleChange(e, "x")} 
               className="w-12 px-1 border rounded text-black font-normal"
            />
            y:
             <input 
               type="number" 
               value={node.args.y} 
               onChange={(e) => handleChange(e, "y")} 
               className="w-12 px-1 border rounded text-black font-normal"
            />
          </span>
        );
      }
    }

    if (cat === "looks") {
      if (cmd === "say") {
         return (
          <span className="flex items-center gap-2">
            Say
             <input 
               type="text" 
               value={node.args.text} 
               onChange={(e) => handleChange(e, "text")} 
               className="w-16 px-1 border rounded text-black font-normal"
            />
            for
             <input 
               type="number" 
               value={node.args.sec} 
               onChange={(e) => handleChange(e, "sec")} 
               className="w-12 px-1 border rounded text-black font-normal"
            />
            secs
          </span>
        );
      }
      if (cmd === "think") {
         return (
          <span className="flex items-center gap-2">
            Think
             <input 
               type="text" 
               value={node.args.text} 
               onChange={(e) => handleChange(e, "text")} 
               className="w-16 px-1 border rounded text-black font-normal"
            />
            for
             <input 
               type="number" 
               value={node.args.sec} 
               onChange={(e) => handleChange(e, "sec")} 
               className="w-12 px-1 border rounded text-black font-normal"
            />
            secs
          </span>
        );
      }
    }

    if (cat === "control" && cmd === "repeat") {
      return (
        <div ref={drop} className="flex flex-col gap-2">
           <span className="flex items-center gap-2">
            Repeat
             <input 
               type="number" 
               value={node.args.count} 
               onChange={(e) => handleChange(e, "count")} 
               className="w-12 px-1 border rounded text-black font-normal"
            />
           </span>
           <div className="pl-4 border-l-4 border-gray-300 min-h-[50px] bg-white/10">
              {node.children && node.children.map(child => (
                   <Block key={child.id} node={child} manager={manager} />
              ))}
              <div className="text-xs text-gray-500 p-2">Drag blocks inside</div>
           </div>
        </div>
      );
    }

    return node.type;
  };

  return (
    <div className="border p-2 my-1 rounded bg-gray-100 shadow-sm font-medium text-sm">
      {renderContent()}
    </div>
  );
}
