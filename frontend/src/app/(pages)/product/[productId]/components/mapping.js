// constants/mappings.js
export const categoryMapping = {
  'DESK': '책상·식탁',
  'DINING_TABLE': '책상·식탁',
  'BED': '침대',
  'SOFA': '의자·소파',
  'CHAIR': '의자·소파',
  'STORAGE': '수납·서랍',
  'DRAWER': '수납·서랍',
  'LIGHTING': '조명·전등',
  'LAMP': '조명·전등',
  'WARDROBE': '가전'
};


export const categoryDetailMapping = {
  'DESK': '책상',
  'DINING_TABLE': '식탁',
  'BED': '침대',
  'SOFA': '소파',
  'CHAIR': '의자',
  'STORAGE': '수납',
  'DRAWER': '서랍',
  'LIGHTING': '조명',
  'LAMP': '전등',
  'WARDROBE': '가전'
};

export const statusMapping = {
  'UNPACKED': '새상품(미개봉)',
  'UNUSED': '사용감 없음',
  'LIKENEW': '사용감 적음',
  'USED': '사용감 많음',
  'BROKEN': '고장/파손 상품'
};

export const moodMapping = {
  'WOOD_VINTAGE': '우드·빈티지',
  'BLACK_METALLIC': '블랙·메탈릭',
  'WHITE_MINIMAL': '화이트·미니멀',
  'MODERN_CLASSIC': '모던·클래식',
};

export const tradeMethodMapping = {
  'IN_PERSON': '직거래',
  'SHIPPING': '택배'
};

export const sellStatusMapping = {
  'RESERVING': '예약중',
  'SOLD': '판매완료',
  'AVAILABLE': '판매중'
};

/* 거래 방식이 리스트로 변경될 경우를 대비한 형식
const tradeMethodMapping = {
  methods: ['IN_PERSON', 'SHIPPING'],
  display: {
    'IN_PERSON': '직거래',
    'SHIPPING': '택배'
  }
};

// 리스트 형식 사용 예시
const displayTradeMethod = (methods) => {
  return methods.map(method => tradeMethodMapping.display[method]).join(', ');
};
*/