// /utils/catalogItems.js
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
    id: "room-wall",
    name: "직사각형 방",
    thickness: 10,
    height: 240,
    image: "/images/newPlanSquare.jpg",
    description: "가로4m, 세로3m 직사각형 방",
    // 방에 사용된 벽 구성 정보
    walls: [
      { x1: 0, y1: 0, x2: 400, y2: 0 }, // 상단 벽
      { x1: 400, y1: 0, x2: 400, y2: 300 }, // 우측 벽
      { x1: 400, y1: 300, x2: 0, y2: 300 }, // 하단 벽
      { x1: 0, y1: 300, x2: 0, y2: 0 }, // 좌측 벽
    ],
  },
  {
    id: "room-wall",
    name: "L자형 방",
    thickness: 10,
    height: 240,
    image: "/images/newPlanL.jpg",
    description: "아무튼 L자모양 방",
    // 방에 사용된 벽 구성 정보
    walls: [
      { x1: 0, y1: 0, x2: 400, y2: 0 }, // 상단 벽
      { x1: 400, y1: 0, x2: 400, y2: 200 }, // 오른쪽 상단 벽
      { x1: 400, y1: 200, x2: 200, y2: 200 }, // 내부 아래쪽 벽 (오른쪽에서 꺾임)
      { x1: 200, y1: 200, x2: 200, y2: 400 }, // 내부 왼쪽 아래 벽
      { x1: 200, y1: 400, x2: 0, y2: 400 }, // 하단 벽
      { x1: 0, y1: 400, x2: 0, y2: 0 }, // 왼쪽 벽
    ],
  },
];

export const furnitureItems = [
  {
    id: "desk",
    name: "식탁이구먼",
    width: 100,
    depth: 60,
    height: 110,
    image: "/images/table1.jpg",
    sellerId: "졸려가구",
    category: "desk",
  },
  {
    id: "desk",
    name: "책상이구먼",
    width: 140,
    depth: 80,
    height: 100,
    image: "/images/desk1.jpg",
    sellerId: "졸려가구",
    category: "desk",
  },
  {
    id: "sofa",
    name: "Sofa",
    width: 200,
    depth: 85,
    height: 80,
    image: "/images/sofa1.jpg",
    sellerId: "졸려가구",
    category: "chair",
  },
  {
    id: "bed",
    name: "싸다싸가구",
    width: 200,
    depth: 150,
    height: 80,
    image: "/images/bed2.png",
    sellerId: "홈꾸가구",
    category: "bed",
  },
  {
    id: "bed",
    name: "집에가구파",
    width: 200,
    depth: 150,
    height: 80,
    image: "/images/bed3.png",
    sellerId: "두리가구",
    category: "bed",
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
