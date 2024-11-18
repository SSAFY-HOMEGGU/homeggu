import React, { useRef } from "react";
import useCanvasStore from "../../store/canvasStore";
import { addImage } from "../../utils/fabricUtils";
import { Upload } from "lucide-react";

const ImageUploader = () => {
  const fileInputRef = useRef(null);
  const { canvas } = useCanvasStore();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === "string") {
        addImage(canvas, dataUrl);
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <button
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={16} />
        <span>Upload Image</span>
      </button>
    </div>
  );
};

export default ImageUploader;
