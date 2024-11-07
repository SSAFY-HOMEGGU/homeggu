// src/app/3ds/components/room/RoomEditor2D/WallLengthDialog.jsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

const WallLengthDialog = ({
  isOpen,
  onClose,
  onConfirm,
  initialAngle = 0, // 드래그 시작했을 때의 각도
}) => {
  const [length, setLength] = useState(100); // 기본값 1m
  const [angle, setAngle] = useState(initialAngle);

  const handleConfirm = () => {
    onConfirm({ length, angle });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>벽 길이 입력</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <span className="w-20">길이:</span>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={10}
              step={10}
            />
            <span>cm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20">각도:</span>
            <Input
              type="number"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              step={15}
            />
            <span>도</span>
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

export default WallLengthDialog;
