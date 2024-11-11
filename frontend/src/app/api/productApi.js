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


// 물건 수정
export const updateSalesBoard = (boardId,formData) => {
  return productInstance.put(`/board/${boardId}`,formData)
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
  page,
  size
  // page = 0,
  // size = 10
}) => {
  const params = new URLSearchParams();

  if (category) params.append('category', category);
  if (min_price !== undefined) params.append('min_price', min_price);
  if (max_price) params.append('max_price', max_price);
  if (isSell) params.append('isSell', isSell);
  if (title) params.append('title', title);
  if (page) params.append('page', page);
  if (size) params.append('size', size);

  return productInstance.get(`/board`)
    .then(response => response.data)
    .catch(error => {
      // 서버에서 보내는 에러 메시지 확인
      console.error('에러 응답:', error.response?.data);
      console.error('에러 상태:', error.response?.status);
      console.error('상세 에러 정보:', error);
      throw error;
})
};