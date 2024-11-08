'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const colorOptions = [
  { type: 'gradientRed', color: '#f55847', gradient: 'linear-gradient(30deg, #f55847, #f00)' },
  { type: 'gradientYellow', color: '#e4c06e', gradient: 'linear-gradient(30deg, #e4c06e, #ffb000)' },
  { type: 'gradientGreen', color: '#88cc6c', gradient: 'linear-gradient(30deg, #88cc6c, #60c437)' },
  { type: 'gradientSky', color: '#77e1f4', gradient: 'linear-gradient(30deg, #77e1f4, #00d9ff)' },
  { type: 'gradientBlue', color: '#4f72a6', gradient: 'linear-gradient(30deg, #4f72a6, #284d7e)' },
  { type: 'gradientGrey', color: '#666666', gradient: 'linear-gradient(30deg, #666666, #aaaaaa)' },
  { type: 'gradientWhite', color: '#fafafa', gradient: 'linear-gradient(30deg, #fafafa, #eaeaea)' },
  { type: 'gradientOrange', color: '#f9ad67', gradient: 'linear-gradient(30deg, #f9ad67, #f97f00)' },
  { type: 'gradientPurple', color: '#a784d9', gradient: 'linear-gradient(30deg, #a784d9, #8951da)' },
  { type: 'gradientPink', color: '#df67bd', gradient: 'linear-gradient(30deg, #df67bd, #e22aae)' },
  { type: 'gradientBlack', color: '#3c3b3b', gradient: 'linear-gradient(30deg, #3c3b3b, #000000)' },
  { type: 'gradientNeutral', color: '#e2c695', gradient: 'linear-gradient(30deg, #e2c695, #c69d56)' }
];

export default function TextEditorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].type);
  const [fontSize, setFontSize] = useState(15);
  const [text, setText] = useState('Your text');

  const handleApply = () => {
    // 여기서 text, fontSize, selectedColor 값을 활용하여 원하는 작업 수행
    console.log({ text, fontSize, selectedColor });
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Open Text Editor
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Text Editor</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Color Picker */}
          <p className="text-sm font-medium mb-2">Choose color</p>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {colorOptions.map(({ type, gradient }) => (
              <button
                key={type}
                onClick={() => setSelectedColor(type)}
                className={`w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-2 transition-all ${
                  selectedColor === type ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                style={{ background: gradient }}
                aria-label={`Select ${type} color`}
              />
            ))}
          </div>

          {/* Font Size Slider */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Font size</p>
            <input
              type="range"
              min="10"
              max="30"
              step="0.1"
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              className="w-full max-w-[200px] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-500">{fontSize}px</span>
          </div>

          {/* Text Input */}
          <div
            contentEditable
            className="min-h-[100px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontSize: `${fontSize}px` }}
            onFocus={(e) => e.currentTarget.innerText === 'Your text' ? e.currentTarget.innerText = '' : null}
            onBlur={(e) => setText(e.currentTarget.innerText)}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="absolute bottom-10 left-[210px] text-blue-500 text-2xl" id="boxinfo" />
    </div>
  );
}