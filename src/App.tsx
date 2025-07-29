import React, { useState } from 'react';
import { SliderProvider } from './context/SliderContext';
import { TopBar } from './components/TopBar';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { Timeline } from './components/Timeline';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SliderProvider>
      <div className="h-screen w-screen flex flex-col bg-white font-sans text-gray-800 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          <Canvas />
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
        <Timeline />
      </div>
    </SliderProvider>
  );
}
