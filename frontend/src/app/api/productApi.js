import { productInstance } from "./axiosInstance";
// import { productInstance } from "./axiosInstanceLocal";


// 물건 등록
export const salesBoard = (formData) => {
  const userId = localStorage.getItem('userId')
  return productInstance.post('/board',formData,{
    headers:{
      userId : userId
    }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 물건 이미지 등록
// export const uploadGoodsImage = async (files) => {
//   const formData = new FormData();
  
//   // FormData에 파일을 추가하기 전에 로깅
//   console.log('Files to upload:', files);
  
//   // files가 FileList인 경우를 처리
//   if (files instanceof FileList) {
//     Array.from(files).forEach((file, index) => {
//       console.log(`Adding file ${index}:`, {
//         name: file.name,
//         type: file.type,
//         size: file.size
//       });
//       formData.append('files', file, file.name);
//     });
//   } 
//   // files가 배열인 경우를 처리
//   else if (Array.isArray(files)) {
//     files.forEach((file, index) => {
//       console.log(`Adding file ${index}:`, {
//         name: file.name,
//         type: file.type,
//         size: file.size
//       });
//       formData.append('files', file, file.name);
//     });
//   }

//   // FormData 내용 확인
//   for (let pair of formData.entries()) {
//     console.log('FormData entry:', {
//       key: pair[0],
//       value: pair[1],
//       fileName: pair[1] instanceof File ? pair[1].name : 'not a file',
//       type: pair[1] instanceof File ? pair[1].type : 'not a file',
//       size: pair[1] instanceof File ? pair[1].size : 'not a file'
//     });
//   }

//   try {
//     const response = await productInstance.post('/board/image', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('이미지 업로드 에러:', {
//       token: !!localStorage.getItem('accessToken'),
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data,
//       headers: error.config?.headers,
//       formDataContent: Array.from(formData.entries())
//     });
//     throw error;
//   }
// };
export const uploadGoodsImage = async (formData) => {
  try {
    const response = await productInstance.post('/board/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error('업로드 실패:', error);
    throw error;
  }
};
  
// 물건 3D 이미지 등록
export const uploadGoods3DImage = async (files) => {
  const formData = new FormData();
  
  // FormData에 파일을 추가하기 전에 로깅
  console.log('Files to upload:', files);
  
  // files가 FileList인 경우를 처리
  if (files instanceof FileList) {
    Array.from(files).forEach((file, index) => {
      console.log(`Adding file ${index}:`, {
        name: file.name,
        type: file.type,
        size: file.size
      });
      formData.append('files', file, file.name);
    });
  } 
  // files가 배열인 경우를 처리
  else if (Array.isArray(files)) {
    files.forEach((file, index) => {
      console.log(`Adding file ${index}:`, {
        name: file.name,
        type: file.type,
        size: file.size
      });
      formData.append('files', file, file.name);
    });
  }

  // FormData 내용 확인
  for (let pair of formData.entries()) {
    console.log('FormData contains:', pair[0], pair[1]);
  }

  try {
    const response = await productInstance.post('/board/3dimage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error('이미지 업로드 에러:', {
      token: !!localStorage.getItem('accessToken'),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.config?.headers,
      formDataContent: Array.from(formData.entries())
    });
    throw error;
  }
};


// 물건 수정
export const updateSalesBoard = (boardId,formData) => {
  const userId = localStorage.getItem('userId')
  return productInstance.put(`/board/${boardId}`,formData,{
    timeout:1000000,
    headers: {userId : userId}
  })
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 물건 삭제
export const deleteSalesBoard = (boardId) => {
  console.time(`상품 상세조회 (ID: ${boardId})`);
  return productInstance.delete(`/board/${boardId}`)
    .then(response => {
      console.timeEnd(`상품 상세조회 (ID: ${boardId})`);
      console.log('상세 조회 응답:', response.data);
      return response.data;
    })
    .catch(error => {
      console.timeEnd(`상품 상세조회 (ID: ${boardId})`);
      console.error('상세 조회 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        error
      });
      throw error;
    });
};

// 물건 상세
export const detailSalesBoard = (boardId) => {
  return productInstance.get(`/board/${boardId}`,{
    timeout:1000000
  })
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
  // page,
  // size
  page = 0,
  size = 8
}) => {
  const params = new URLSearchParams();
  console.log('params',params)
  if (category) params.append('category', category);
  if (min_price !== undefined) params.append('min_price', min_price);
  if (max_price) params.append('max_price', max_price);
  if (isSell) params.append('isSell', isSell);
  if (title) params.append('title', title);
  // if (page) params.append('page', page);
  // if (size) params.append('size', size);
  params.append('page', page);  // 항상 포함
  params.append('size', size);  // 항상 포함

  const url = `/board?${params.toString()}`;
  console.log('🚀 API 호출 URL:', url);
  console.log('🚀 요청 파라미터:', {
    category,
    min_price,
    max_price,
    isSell,  
    title,
    page,
    size
  });

  return productInstance.get(url,{
      timeout: 100000  // 10초
    })
    .then(response => response.data)
    .catch(error => {
      console.error('❌ API 에러 발생');
      // console.error('에러 응답:', error.response?.data);
      console.error('에러 상태:', error.response?.status);
      console.error('상세 에러:', error);
      throw error;
})
};