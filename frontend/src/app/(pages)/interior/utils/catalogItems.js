//interior/utils/catalogItems.js
import { productInstance } from "@/app/api/axiosInstance";

// 벽 타입은 그대로 유지 (API에서 가져오지 않음)
export const wallTypes = [
  {
    id: "normal-wall",
    name: "일반 벽",
    thickness: 10,
    height: 240,
    image: "/images/newPlanWall.jpg",
    description: "그냥 벽이구먼요",
  },
  {
    id: "rectangular-room",
    name: "직사각형 방",
    thickness: 10,
    height: 240,
    image: "/images/newPlanSquare.jpg",
    description: "가로4m, 세로3m 직사각형 방",
    walls: [
      { x1: 0, y1: 0, x2: 400, y2: 0 },
      { x1: 400, y1: 0, x2: 400, y2: 300 },
      { x1: 400, y1: 300, x2: 0, y2: 300 },
      { x1: 0, y1: 300, x2: 0, y2: 0 },
    ],
  },
  {
    id: "L-room",
    name: "L자형 방",
    thickness: 10,
    height: 240,
    image: "/images/newPlanL.jpg",
    description: "아무튼 L자모양 방",
    walls: [
      { x1: 0, y1: 0, x2: 400, y2: 0 },
      { x1: 400, y1: 0, x2: 400, y2: 200 },
      { x1: 400, y1: 200, x2: 200, y2: 200 },
      { x1: 200, y1: 200, x2: 200, y2: 400 },
      { x1: 200, y1: 400, x2: 0, y2: 400 },
      { x1: 0, y1: 400, x2: 0, y2: 0 },
    ],
  },
];

// 카테고리 상수
export const FURNITURE_CATEGORIES = [
  { id: "BED", name: "침대" },
  { id: "DINING_TABLE", name: "식탁" },
  { id: "SOFA", name: "쇼파" },
  { id: "CHAIR", name: "의자" },
  { id: "DRESSER", name: "서랍장" },
  { id: "DESK", name: "책상" },
  { id: "TV_CABINET", name: "TV장" },
  { id: "BOOKSHELF", name: "책장" },
  { id: "WARDROBE", name: "장농" },
  { id: "LIGHTING", name: "조명기구" },
  { id: "DECOR_ITEM", name: "데코 아이템" },
];

// API로부터 가구 아이템을 가져오는 함수
export const getFurnitureItems = async (category = "", page = 0, size = 20) => {
  try {
    const response = await productInstance.get("/board", {
      params: {
        category,
        page,
        size,
        isSell: "AVAILABLE", // 판매 가능한 상품만 가져오기
      },
    });

    // API 응답 데이터를 furnitureItems 형식으로 변환
    const items = response.data.content.map((item) => ({
      id: item.salesBoardId.toString(),
      name: item.title,
      width: item.goods_x,
      depth: item.goods_y,
      height: item.goods_z,
      image: item.goodsImagePaths[0] || "/images/placeholder.jpg", // 첫 번째 2D 이미지
      glbPath: item.threeDimensionsGoodsImagePaths[0] || null, // 3D .glb 파일 경로
      sellerId: `판매자 ${item.userId}`,
      category: item.category,
      price: item.price,
      status: item.status,
      deliveryPrice: item.deliveryPrice,
    }));

    return {
      items,
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
      currentPage: response.data.number,
    };
  } catch (error) {
    console.error("가구 데이터 로딩 실패:", error);
    return {
      items: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
    };
  }
};

// 초기 상태는 빈 배열로 설정
export const furnitureItems = [];
