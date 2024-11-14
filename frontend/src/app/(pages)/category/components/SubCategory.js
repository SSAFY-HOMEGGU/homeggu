'use client'

import { useState } from 'react';
import CategoryProducts from "../components/CategoryProducts";

const SubCategoryNav = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-4 mb-8 font-tmoney text-[1.5rem]">
      {categories.map((category, index) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`hover:text-point1 transition-colors ${
            activeCategory === category ? 'text-point1 font-bold' : 'text-gray-700 font-bold'
          }`}
        >
          {category}
          {index < categories.length - 1 && <span className="ml-4 text-gray-300">·</span>}
        </button>
      ))}
    </div>
  );
};

// 각 메인 카테고리별 서브 카테고리 매핑
const CATEGORY_GROUPS = {
  "침대": ["침대"],
  "책상/식탁": ["책상", "식탁"],
  "수납/서랍": ["수납", "서랍"],
  "조명/전등": ["조명", "전등"],
  "가전": ["가전"],
  "소파/의자": ["소파","의자"],
  // 필요한 다른 그룹들 추가
};

export default function CategoryPage({ mainCategory = "책상/식탁" }) {
  const subCategories = CATEGORY_GROUPS[mainCategory] || [];
  const [activeCategory, setActiveCategory] = useState(subCategories[0]);

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-6 font-tmoney">{mainCategory}</h1> */}
      <SubCategoryNav
        categories={subCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <CategoryProducts categoryName={activeCategory} />
    </div>
  );
}