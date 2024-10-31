// src/app/3ds/components/room/EditorToolbar/index.jsx
"use client";

import {
  PenLine,
  Door,
  Ruler,
  RotateCw,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  MousePointer,
} from "lucide-react";
import ToolButton from "./ToolButton";
import { TOOL_TYPES } from "@/app/constants/roomEditor";

const TOOLS = [
  { id: TOOL_TYPES.SELECT, icon: MousePointer, label: "선택" },
  { id: TOOL_TYPES.WALL, icon: PenLine, label: "벽 그리기" },
  { id: TOOL_TYPES.DOOR, icon: Door, label: "문/창문" },
  { id: TOOL_TYPES.DIMENSION, icon: Ruler, label: "치수선" },
];

const EditorToolbar = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  canUndo,
  canRedo,
  scale,
  onScaleChange,
  onRotate,
}) => {
  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* 도구 버튼들 */}
        <div className="flex gap-1 border-r pr-2">
          {TOOLS.map((tool) => (
            <ToolButton
              key={tool.id}
              icon={tool.icon}
              label={tool.label}
              active={activeTool === tool.id}
              onClick={() => onToolChange(tool.id)}
            />
          ))}
        </div>

        {/* 회전 버튼 */}
        <ToolButton icon={RotateCw} label="회전" onClick={onRotate} />

        {/* 축척 선택 */}
        <div className="flex items-center gap-2 border-l pl-2">
          <span className="text-sm text-gray-500">축척:</span>
          <select
            value={scale}
            onChange={(e) => onScaleChange(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            <option value={0.5}>1:200</option>
            <option value={1}>1:100</option>
            <option value={2}>1:50</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 실행취소/다시실행 */}
        <div className="flex gap-1 border-r pr-2">
          <ToolButton
            icon={Undo2}
            label="실행취소"
            onClick={onUndo}
            disabled={!canUndo}
          />
          <ToolButton
            icon={Redo2}
            label="다시실행"
            onClick={onRedo}
            disabled={!canRedo}
          />
        </div>

        {/* 저장/불러오기 */}
        <div className="flex gap-1">
          <ToolButton icon={Save} label="저장" onClick={onSave} />
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={onLoad}
              className="hidden"
              id="load-file"
            />
            <label htmlFor="load-file">
              <ToolButton
                icon={FolderOpen}
                label="불러오기"
                onClick={() => {}}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
