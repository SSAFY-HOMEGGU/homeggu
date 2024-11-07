import { productInstance } from "./axiosInstance";

// 물건 등록
export const salesBoard = (formData) => {
  return productInstance.post('/board',formData)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};
// requestBody
// {
//   "title": "중고 가구 판매합니다",
//   "content": "상태 좋고 거의 새것입니다.",
//   "category": "SOFA",
//   "status": "UNUSED",
//   "tradeMethod": "IN_PERSON",
//   "isSafe": true,
//   "hope_location": "유성온천역",
//   "price": 100000,
//   "delivery_price": 0
// }

// 물건 등록
export const updateSalesBoard = (boardId,formData) => {
  return productInstance.post(`/board/${boardId}`,formData)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 물건 삭제
export const deleteSalesBoard = (boardId) => {
  return productInstance.delete(`/board/${boardId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 물건 상세
export const detailSalesBoard = (boardId) => {
  return productInstance.get(`/board/${boardId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 물건 리스트
export const salesBoardList = ({
  category,
  min_price,
  max_price,
  isSell,
  title,
  page = 0,
  size = 10
}) => {
  const params = new URLSearchParams();

  if (category) params.append('category', category);
  if (min_price) params.append('min_price', min_price);
  if (max_price) params.append('max_price', max_price);
  if (isSell) params.append('isSell', isSell);
  if (title) params.append('title', title);
  params.append('page', page);
  params.append('size', size);

  return productInstance.get(`/board/?${params.toString()}`)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};