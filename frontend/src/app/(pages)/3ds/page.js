// src/app/3ds/page.js
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import RoomEditor2D from "./components/room/RoomEditor2D";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  const handleNewRoom = () => {
    setIsModalOpen(false);
    setShowEditor(true);
  };

  const handleRoomList = () => {
    // 저장된 방 목록으로 이동 로직
  };

  if (showEditor) {
    return <RoomEditor2D />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white/95">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              나만의 공간을 만들어보세요
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 p-4">
            <button
              onClick={handleNewRoom}
              className="flex flex-col items-center justify-center h-32 border rounded-lg hover:border-[#35C5F0] hover:text-[#35C5F0] transition-colors p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>새로운 공간 만들기</span>
              <span className="text-sm text-gray-500 mt-1">
                직접 그리고 꾸미기
              </span>
            </button>
            <button
              onClick={handleRoomList}
              className="flex flex-col items-center justify-center h-32 border rounded-lg hover:border-[#35C5F0] hover:text-[#35C5F0] transition-colors p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <span>내가 만든 공간 보기</span>
              <span className="text-sm text-gray-500 mt-1">
                저장된 도면 확인
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
