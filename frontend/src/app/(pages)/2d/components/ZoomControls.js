'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ZoomControls() {
  const [scale, setScale] = useState('1m');

  const handleZoom = (action) => {
    switch(action) {
      case 'zoomin':
        console.log('Zoom in');
        break;
      case 'zoomout':
        console.log('Zoom out');
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed right-[-150px] bottom-5 z-50 text-center bg-transparent transition-all duration-200 ease-in">
      <div className="flex justify-end gap-2 mb-2 mr-2.5">
        <button 
          onClick={() => handleZoom('zoomin')}
          className="p-2 bg-white hover:bg-gray-100 rounded shadow transition-colors"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleZoom('zoomout')}
          className="p-2 bg-white hover:bg-gray-100 rounded shadow transition-colors"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex justify-end mr-2.5">
        <div className="w-[60px] h-5 bg-blue-600 rounded text-white text-sm flex items-center justify-center shadow">
          {scale}
        </div>
      </div>
    </div>
  );
}