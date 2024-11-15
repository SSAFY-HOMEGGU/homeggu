//interior/components/Catalog/Catalog.js

"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import useCanvasStore from "../../store/canvasStore";
import {
  wallTypes,
  furnitureItems,
  FURNITURE_CATEGORIES,
} from "../../utils/catalogItems";

const Catalog = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { canvas, setMode } = useCanvasStore();
  const addFurniture = useCanvasStore((state) => state.addFurniture);

  const filteredFurniture = furnitureItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectItem = (item) => {
    if (item.type === "wall") {
      if (!canvas) return;

      const wallType = {
        thickness: item.thickness,
        height: item.height,
      };
      canvas.setWallType?.(wallType);
      setMode("wall");
    } else if (item.type === "furniture") {
      addFurniture(item);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Open Catalog</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Input
            placeholder="Search items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <Tabs defaultValue="walls" className="flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="walls">Walls</TabsTrigger>
            {FURNITURE_CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="walls"
            className="mt-4 h-[calc(100vh-300px)] overflow-y-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wallTypes.map((wall) => (
                <div
                  key={wall.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => handleSelectItem({ type: "wall", ...wall })}
                >
                  <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <div
                      className="bg-gray-400"
                      style={{
                        width: "100%",
                        height: `${wall.thickness}px`,
                      }}
                    />
                  </div>
                  <h3 className="font-semibold">{wall.name}</h3>
                  <p className="text-sm text-gray-600">
                    Thickness: {wall.thickness}cm
                  </p>
                  <p className="text-sm text-gray-600">
                    Height: {wall.height}cm
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {wall.description}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {FURNITURE_CATEGORIES.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="mt-4 h-[calc(100vh-300px)] overflow-y-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredFurniture
                  .filter((item) => item.category === category.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() =>
                        handleSelectItem({ type: "furniture", ...item })
                      }
                    >
                      <div className="w-full h-32 bg-gray-100 rounded mb-2" />
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.width}x{item.depth}x{item.height}cm
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {item.description}
                      </p>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Catalog;
