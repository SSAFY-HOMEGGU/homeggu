'use client';

import { useState, useCallback } from 'react';
import { 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  MousePointer,
  Scissors,
  Expand,
  Minimize
} from 'lucide-react';

const doorList = [
  { id: 'aperture', label: 'Aperture' },
  { id: 'simple', label: 'Simple' },
  { id: 'double', label: 'Double' },
  { id: 'pocket', label: 'Pocket' }
];

const windowList = [
  { id: 'fix', label: 'Fix' },
  { id: 'flap', label: 'Simple' },
  { id: 'twin', label: 'Double' },
  { id: 'bay', label: 'Slide' }
];

const energyGroups = [
  {
    title: 'High current',
    items: [
      { id: 'gtl', label: 'Switchboard' },
      { id: 'switch', label: 'Switch' },
      { id: 'doubleSwitch', label: 'Multiways' },
      { id: 'dimmer', label: 'Variator' },
      { id: 'plug', label: 'Electrical outlet' },
      { id: 'plug20', label: 'Outlet 20A' },
      { id: 'plug32', label: 'Outlet 32A' },
      { id: 'rooflight', label: 'Ceiling lamp' },
      { id: 'walllight', label: 'Wall light' }
    ]
  },
  {
    title: 'Low current',
    items: [
      { id: 'www', label: 'Internet access' },
      { id: 'rj45', label: 'RJ45 plug' },
      { id: 'tv', label: 'Antenna plug' }
    ]
  },
  {
    title: 'Thermal',
    items: [
      { id: 'boiler', label: 'Boiler' },
      { id: 'heater', label: 'Water heater' },
      { id: 'radiator', label: 'Radiator' }
    ]
  }
];

const layerOptions = [
  { id: 'showRib', label: 'Measurement' },
  { id: 'showArea', label: 'Surface' },
  { id: 'showLayerRoom', label: 'Texture' },
  { id: 'showLayerEnergy', label: 'Energy' }
];

export default function Sidebar() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeList, setActiveList] = useState(null);

  const toggleList = useCallback((listName) => {
    setActiveList(prev => prev === listName ? null : listName);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  }, [isFullscreen]);

  return (
    <>
      {/* Report Tools */}
      <div className="fixed top-0 left-0 w-[500px] h-screen bg-white shadow-md p-3.5 z-10 overflow-y-auto overflow-x-hidden hidden">
        <h2 className="flex items-center gap-2">
          <Calculator className="w-5 h-5" /> Report plan
        </h2>
        <div className="mt-8">
          <h2 className="hidden" id="reportTotalSurface" />
          <h2 className="hidden" id="reportNumberSurface" />
          <hr className="my-4" />
          <section id="reportRooms" className="hidden" />
          <button className="w-full mt-12 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
            <ChevronLeft className="w-8 h-8 mx-auto" />
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="fixed top-0 left-0 w-[200px] h-screen bg-white shadow-md p-3.5 z-10 text-sm">
        <ul className="space-y-4">
          {/* Undo/Redo */}
          <li className="flex gap-2">
            <button 
              className="w-[47%] bg-gray-100 p-2 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors" 
              id="undo" 
              title="undo"
            >
              <ChevronLeft className="w-5 h-5 mx-auto" />
            </button>
            <button 
              className="w-[47%] bg-gray-100 p-2 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors" 
              id="redo" 
              title="redo"
            >
              <ChevronRight className="w-5 h-5 mx-auto" />
            </button>
          </li>

          {/* Select Mode */}
          <li>
            <button className="w-full bg-green-500 text-white p-2 rounded shadow hover:bg-green-600 transition-colors" id="select_mode">
              <MousePointer className="w-8 h-8 mx-auto" />
            </button>
          </li>

          {/* Wall Controls */}
          <li className="space-y-2">
            <button 
              className="w-full bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors" 
              id="line_mode"
              title="Make walls"
            >
              WALL
            </button>
            <button 
              className="w-full bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors" 
              id="partition_mode"
              title="Make partitions wall"
            >
              PARTITION
            </button>
            <div>
              <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" id="multi" defaultChecked className="mr-2" />
                MULTIPLE
              </label>
            </div>
          </li>

          {/* Room Config */}
          <li>
            <button 
              className="w-full bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors" 
              id="room_mode"
            >
              CONFIG. ROOMS
            </button>
          </li>

          {/* Node Mode */}
          <li>
            <button 
              className="w-full bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors" 
              id="node_mode"
            >
              <Scissors className="w-8 h-8 mx-auto" />
            </button>
          </li>

          {/* Door Controls */}
          <li className="relative">
            <button 
              className="w-full bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors" 
              onClick={() => toggleList('door')}
            >
              DOOR
            </button>
            {/* Door List Popup */}
            <div className={`absolute left-[200px] top-0 w-[150px] bg-white p-2.5 rounded shadow-md space-y-2 ${activeList === 'door' ? 'block' : 'hidden'}`}>
              {doorList.map(door => (
                <button 
                  key={door.id}
                  className="w-full bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors"
                  id={door.id}
                >
                  {door.label}
                </button>
              ))}
            </div>
          </li>

          {/* Window Controls */}
          <li className="relative">
            <button 
              className="w-full bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors" 
              onClick={() => toggleList('window')}
            >
              WINDOW
            </button>
            {/* Window List Popup */}
            <div className={`absolute left-[200px] top-0 w-[150px] bg-white p-2.5 rounded shadow-md space-y-2 ${activeList === 'window' ? 'block' : 'hidden'}`}>
              {windowList.map(window => (
                <button 
                  key={window.id}
                  className="w-full bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors"
                  id={window.id}
                >
                  {window.label}
                </button>
              ))}
            </div>
          </li>

          {/* Energy Controls */}
          <li className="relative">
            <button 
              className="w-full bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors" 
              onClick={() => toggleList('energy')}
            >
              ENERGY
            </button>
            {/* Energy List Popup */}
            <div className={`absolute left-[200px] bottom-10 w-[600px] bg-white p-5 rounded shadow-md ${activeList === 'energy' ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-3 gap-4">
                {energyGroups.map(group => (
                  <div key={group.title} className="border rounded p-4">
                    <h3 className="font-medium mb-3">{group.title}</h3>
                    <div className="space-y-2">
                      {group.items.map(item => (
                        <button
                          key={item.id}
                          id={item.id}
                          className="w-full bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </li>

          {/* Layer Controls */}
          <li className="relative">
            <button 
              className="w-full bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors"
              onClick={() => toggleList('layer')}
            >
              Layers
            </button>
            {/* Layer Options */}
            <div className={`absolute left-[200px] bottom-[100px] w-[200px] bg-white p-2.5 rounded shadow-md space-y-2 ${activeList === 'layer' ? 'block' : 'hidden'}`}>
              {layerOptions.map(layer => (
                <label 
                  key={layer.id} 
                  className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input type="checkbox" id={layer.id} defaultChecked className="mr-2" />
                  {layer.label}
                </label>
              ))}
            </div>
          </li>

          {/* Bottom Controls */}
          <li className="flex gap-2">
            <button 
              className="w-[47%] bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors" 
              id="report_mode" 
              title="Show report"
            >
              <Calculator className="w-5 h-5 mx-auto" />
            </button>
            <button 
              className="w-[47%] bg-gray-100 p-2 rounded shadow hover:bg-gray-200 transition-colors"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 mx-auto" />
              ) : (
                <Expand className="w-5 h-5 mx-auto" />
              )}
            </button>
          </li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes myAnim {
          0% { stroke-width: 0 }
          50% { stroke-width: 8 }
          100% { stroke-width: 0 }
        }
        
        @keyframes myAnim2 {
          0% { stroke-width: 4 }
          50% { stroke-width: 7 }
          100% { stroke-width: 4 }
        }
      `}</style>
    </>
  );
}