'use client';

import { useState } from 'react';
import { 
  Scissors, 
  Crop, 
  Trash2, 
  ChevronLeft 
} from 'lucide-react';

export default function WallTools() {
  const [wallWidth, setWallWidth] = useState(10);
  const [isVisible, setIsVisible] = useState(true);

  // 벽 자르기 기능
  const handleSplitWall = () => {
    // editor.splitWall() 기능 구현
    console.log('Split wall at:', wallWidth);
  };

  // 벽 숨기기/보이기 기능
  const handleWallVisibility = (visible) => {
    setIsVisible(visible);
    // visible ? editor.visibleWall() : editor.invisibleWall()
    console.log('Wall visibility:', visible);
  };

  // 벽 삭제 기능
  const handleDeleteWall = () => {
    // 벽 삭제 로직 구현
    console.log('Delete wall');
  };

  // 선택 모드로 돌아가기
  const handleBackToSelect = () => {
    // fonc_button('select_mode') 대체 로직
    console.log('Back to select mode');
  };

  return (
    <div className="fixed top-0 left-0 w-[300px] bg-white shadow-lg p-4 overflow-y-auto">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">Modify the wall</h2>
      <hr className="my-4" />

      {/* Wall Width Control */}
      <section className="mb-6">
        <p className="mb-2">
          Width [{wallWidth}] : <span>{wallWidth} cm</span>
        </p>
        <input
          type="range"
          value={wallWidth}
          onChange={(e) => setWallWidth(parseFloat(e.target.value))}
          step="0.1"
          min="5"
          max="50"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </section>

      <ul className="space-y-6">
        {/* Cut Wall Section */}
        <li>
          <section>
            <p className="mb-2">Cut the wall:</p>
            <p className="text-sm text-gray-500 mb-2">
              A cut will be made at each wall encountered.
            </p>
            <button
              onClick={handleSplitWall}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded shadow transition-colors"
            >
              <Scissors className="w-6 h-6 mx-auto" />
            </button>
          </section>
        </li>

        {/* Wall Visibility Section */}
        <li>
          <section>
            <p className="mb-2">
              {isVisible ? 'Separation wall:' : 'Transform to wall:'}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {isVisible
                ? 'Transform the wall into simple separation line.'
                : 'The thickness will be identical to the last known.'}
            </p>
            <button
              onClick={() => handleWallVisibility(!isVisible)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded shadow transition-colors"
            >
              <Crop className="w-6 h-6 mx-auto" />
            </button>
          </section>
        </li>

        {/* Delete Wall Button */}
        <li>
          <button
            onClick={handleDeleteWall}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition-colors"
          >
            <Trash2 className="w-6 h-6 mx-auto" />
          </button>
        </li>

        {/* Back Button */}
        <li>
          <button
            onClick={handleBackToSelect}
            className="w-full px-4 py-2 mt-8 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition-colors"
          >
            <ChevronLeft className="w-6 h-6 mx-auto" />
          </button>
        </li>
      </ul>
    </div>
  );
}