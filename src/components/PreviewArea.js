
import React, { useEffect, useState } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ manager }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000 / 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {manager.sprites.map((sprite) => (
        <CatSprite
          key={sprite.id}
          sprite={sprite}
          manager={manager}
        />
      ))}
    </div>
  );
}
