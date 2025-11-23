
import MidArea from "./components/MidArea";
import Sidebar from "./components/Sidebar";
import PreviewArea from "./components/PreviewArea";
import PlayBar from "./components/PlayBar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SpriteManager from './components/SpriteManager';
import React, { useState } from "react";

export default function App() {
    const [manager] = useState(() => new SpriteManager());
    const [, setTick] = useState(0);

    manager.forceUpdate = () => setTick(t => t + 1);


return (
<DndProvider backend={HTML5Backend}>
<div className="bg-blue-100 pt-6 font-sans">
<div className="h-screen overflow-hidden flex flex-row ">
<div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
<Sidebar />
<MidArea manager={manager} />
</div>
<div className="w-1/3 h-screen overflow-hidden flex flex-col bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
<PlayBar manager={manager} />
<PreviewArea manager={manager} />
</div>
</div>
</div>
</DndProvider>
);
}