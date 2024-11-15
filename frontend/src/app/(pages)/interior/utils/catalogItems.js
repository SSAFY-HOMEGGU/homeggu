// /utils/catalogItems.js
export const wallTypes = [
  {
    id: "normal-wall",
    name: "Normal Wall",
    thickness: 20,
    height: 250,
    image: "/api/placeholder/100/100",
    description: "Standard wall for interior and exterior use",
  },
  {
    id: "thick-wall",
    name: "Thick Wall",
    thickness: 40,
    height: 250,
    image: "/api/placeholder/100/100",
    description: "Thick wall for exterior use",
  },
  {
    id: "partition-wall",
    name: "Partition Wall",
    thickness: 10,
    height: 250,
    image: "/api/placeholder/100/100",
    description: "Thin wall for interior partitions",
  },
];

export const furnitureItems = [
  // Living Room
  {
    id: "sofa",
    name: "Sofa",
    width: 200,
    depth: 85,
    height: 80,
    image: "/api/placeholder/100/100",
    description: "Comfortable three-seater sofa",
    category: "living",
  },
  // ... (이전에 제시한 모든 가구 아이템들)
];

// 카테고리 상수
export const FURNITURE_CATEGORIES = [
  { id: "living", name: "Living Room" },
  { id: "dining", name: "Dining Room" },
  { id: "bedroom", name: "Bedroom" },
  { id: "kitchen", name: "Kitchen" },
  { id: "bathroom", name: "Bathroom" },
];
