// src/app/3ds/components/room/RoomEditor2D/RoomSizeDialog.jsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

const RoomSizeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  currentWidth,
  currentHeight,
}) => {
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);

  const handleConfirm = () => {
    onConfirm({ width, height });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>방 크기 조정</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <span className="w-20">가로:</span>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={100}
              step={10}
            />
            <span>cm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20">세로:</span>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={100}
              step={10}
            />
            <span>cm</span>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleConfirm}>확인</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomSizeDialog;
