'use client';

import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Target
} from 'lucide-react';

export default function MoveControls() {
  const handleMove = (action) => {
    switch(action) {
      case 'top':
        console.log('Move up');
        break;
      case 'bottom':
        console.log('Move down');
        break;
      case 'left':
        console.log('Move left');
        break;
      case 'right':
        console.log('Move right');
        break;
      case 'reset':
        console.log('Reset view');
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed right-[-150px] top-2.5 z-50 text-center bg-transparent transition-all duration-200 ease-in">
      <p className="m-0 text-xs text-blue-600 cursor-pointer flex items-center justify-center gap-1" 
         onClick={() => window.location.href='https://github.com/ekymoz/homeRoughEditor'}>
        <img 
          src="/api/placeholder/20/20" 
          alt="Home Rough Editor"
          className="w-5 h-5"
        />
        Home Rough Editor
      </p>

      <div className="flex flex-col items-center gap-1 mt-2.5">
        {/* Top Button */}
        <button 
          onClick={() => handleMove('top')}
          className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition-colors"
          aria-label="Move up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Middle Row */}
        <div className="flex gap-1">
          <button 
            onClick={() => handleMove('left')}
            className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition-colors"
            aria-label="Move left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleMove('reset')}
            className="p-1 bg-white hover:bg-gray-100 rounded shadow transition-colors"
            aria-label="Reset view"
          >
            <Target className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleMove('right')}
            className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition-colors"
            aria-label="Move right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Button */}
        <button 
          onClick={() => handleMove('bottom')}
          className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition-colors"
          aria-label="Move down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}