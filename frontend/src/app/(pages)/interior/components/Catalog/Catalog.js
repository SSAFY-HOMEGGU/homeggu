"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
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
  FURNITURE_CATEGORIES,
  getFurnitureItems,
} from "../../utils/catalogItems";

const Catalog = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const { canvas, setMode } = useCanvasStore();
  const addFurniture = useCanvasStore((state) => state.addFurniture);

  // 가구 데이터 로딩 함수
  const loadFurnitureData = async (category) => {
    setIsLoading(true);
    try {
      const response = await getFurnitureItems(
        category,
        pagination.currentPage
      );
      setFurnitureItems(response.items);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
    } catch (error) {
      console.error("가구 데이터 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 변경시 데이터 로딩
  useEffect(() => {
    if (currentCategory && currentCategory !== "walls") {
      loadFurnitureData(currentCategory);
    }
  }, [currentCategory]);

  // 검색어로 필터링
  const filteredFurniture = furnitureItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectItem = (item) => {
    if (item.type === "wall") {
      if (item.id === "room-wall") {
        useCanvasStore.getState().addPredefinedRoom(item.id);
      } else {
        const wallType = {
          thickness: item.thickness,
          height: item.height,
        };
        canvas.setWallType?.(wallType);
        setMode("wall");
      }
    } else if (item.type === "furniture") {
      // 3D 모델 정보를 포함하여 가구 추가
      const furnitureData = {
        ...item,
        metadata: {
          ...item,
          model3D: item.glbPath
            ? {
                glb: item.glbPath,
                width: item.width,
                height: item.height,
                depth: item.depth,
              }
            : null,
        },
      };
      addFurniture(furnitureData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>카달로그 보기</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Input
            placeholder="이름 또는 제품명 검색"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <Tabs
          defaultValue="walls"
          className="flex-1"
          onValueChange={(value) => setCurrentCategory(value)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="walls">벽 & 방</TabsTrigger>
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
                    <Image
                      src={wall.image}
                      alt={wall.name}
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </div>
                  <h3 className="font-semibold">{wall.name}</h3>
                  <p className="text-sm text-gray-600">
                    벽 두께: {wall.thickness}cm
                  </p>
                  <p className="text-sm text-gray-600">
                    천장까지의 높이: {wall.height}cm
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
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  로딩중...
                </div>
              ) : (
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
                        <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={110}
                            height={110}
                            className="rounded"
                          />
                        </div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.width}x{item.depth}x{item.height}cm
                        </p>
                        <p className="text-sm text-gray-600">
                          가격: {item.price.toLocaleString()}원
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Catalog;
