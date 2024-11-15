

// import axios from 'axios';
// import { salesBoard, uploadGoods3DImage, updateSalesBoard } from '@/app/api/productApi';

// class BackgroundConversionService {
//   constructor() {
//     this.polling = null;
//     this.POLLING_INTERVAL = 3000;
//     this.MAX_RETRIES = 3;
//     this.retryCount = 0;
//   }

//   async startConversion(mainImageUrl, formData) {
//     const MESHY_API_KEY = 'msy_99FYmmosDk1oyIcQMZfGGBgn2VwokDVv6D5L';

//     try {
//       console.log('1. 상품 등록 시작');
//       const productResponse = await salesBoard(formData);
//       const productId = productResponse.id;
//       console.log('상품 등록 완료. 상품 ID:', productId);
  
//       console.log('2. Meshy API 호출 시작');
//       const meshyResponse = await axios.post(
//         'https://api.meshy.ai/v1/image-to-3d',
//         {
//           image_url: mainImageUrl,
//           enable_pbr: true
//         },
//         { 
//           headers: { 
//             Authorization: `Bearer ${MESHY_API_KEY}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       const taskId = meshyResponse.data.result;
//       console.log('Meshy API 호출 완료. Task ID:', taskId);
      
//       this.startPolling(taskId, MESHY_API_KEY, productId);
//       return taskId;
//     } catch (error) {
//       console.error('에러 발생:', error);
//       throw error;
//     }
//   }

//   async download3DModel(modelUrls) {
//     try {
//       console.log('3. OBJ 파일 다운로드 시작');
//       const objUrl = modelUrls.obj;
//       console.log('다운로드할 OBJ URL:', objUrl);
      
//       const response = await axios({
//         url: objUrl,
//         method: 'GET',
//         responseType: 'blob',
//         headers: {
//           'Accept': 'application/object',
//           'Access-Control-Allow-Origin': '*'
//         }
//       });
      
//       // 응답 상태 체크
//       if (response.status !== 200) {
//         throw new Error(`다운로드 실패: ${response.status}`);
//       }
      
//       console.log('OBJ 파일 다운로드 응답:', response);
//       const blob = response.data;
      
//       // 파일 크기 체크
//       if (blob.size === 0) {
//         throw new Error('다운로드된 파일이 비어있습니다');
//       }
      
//       console.log('다운로드된 파일 크기:', blob.size, 'bytes');
      
//       const file = new File([blob], 'model.obj', { 
//         type: 'application/object' 
//       });
//       console.log('OBJ 파일 생성 완료');
      
//       return file;
//     } catch (error) {
//       console.error('OBJ 파일 다운로드 실패:', error);
//       throw error;
//     }
//   }

//   startPolling(taskId, apiKey, productId) {
//     if (this.polling) {
//       clearInterval(this.polling);
//     }

//     this.polling = setInterval(async () => {
//       try {
//         console.log('4. 변환 상태 확인 중...');
//         const response = await axios.get(
//           `https://api.meshy.ai/v1/image-to-3d/${taskId}`,
//           { 
//             headers: { Authorization: `Bearer ${apiKey}` }
//           }
//         );

//         const { status, progress, model_urls } = response.data;
//         console.log('변환 진행률:', progress + '%');

//         if (status === 'SUCCEEDED' && progress === 100) {
//           console.log('변환 완료. 모델 URL:', model_urls);
          
//           if (this.retryCount >= this.MAX_RETRIES) {
//             console.log('최대 재시도 횟수 도달');
//             this.stopPolling();
//             return;
//           }

//           try {
//             const modelFile = await this.download3DModel(model_urls);
//             console.log('5. 서버에 OBJ 파일 업로드 시작');
            
//             const uploadResponse = await uploadGoods3DImage([modelFile]);
//             console.log('서버 업로드 응답:', uploadResponse);
            
//             await updateSalesBoard(productId, {
//               threeDimensionsGoodsImagePaths: uploadResponse
//             });
//             console.log('6. 상품 정보 업데이트 완료');

//             this.stopPolling();
//           } catch (error) {
//             console.error('OBJ 파일 처리 실패:', error);
//             this.retryCount++;
//           }
//         } 
        
//         if (status === 'FAILED') {
//           console.error('3D 모델 변환 실패');
//           this.stopPolling();
//         }
//       } catch (error) {
//         console.error('상태 확인 중 오류:', error);
//         this.stopPolling();
//       }
//     }, this.POLLING_INTERVAL);
//   }

//   stopPolling() {
//     if (this.polling) {
//       clearInterval(this.polling);
//       this.polling = null;
//       this.retryCount = 0;
//       console.log('폴링 종료');
//     }
//   }
// }

// export const backgroundConversionService = new BackgroundConversionService();


import axios from 'axios';
import { salesBoard, uploadGoods3DImage, updateSalesBoard } from '@/app/api/productApi';

class BackgroundConversionService {
  constructor() {
    this.polling = null;
    this.POLLING_INTERVAL = 3000;
  }

  async startConversion(mainImageUrl, formData) {
    const MESHY_API_KEY = 'msy_99FYmmosDk1oyIcQMZfGGBgn2VwokDVv6D5L';

    try {
      console.log('1. 상품 등록 시작');
      const productResponse = await salesBoard(formData);
      const productId = productResponse.id;
      console.log('상품 등록 완료. 상품 ID:', productId);
  
      console.log('2. Meshy API 호출 시작');
      const meshyResponse = await axios.post(
        'https://api.meshy.ai/v1/image-to-3d',
        {
          image_url: mainImageUrl,
          enable_pbr: true
        },
        { 
          headers: { 
            Authorization: `Bearer ${MESHY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const taskId = meshyResponse.data.result;
      console.log('Meshy API 호출 완료. Task ID:', taskId);
      
      this.startPolling(taskId, MESHY_API_KEY, productId);
      return taskId;
    } catch (error) {
      console.error('에러 발생:', error);
      throw error;
    }
  }

  startPolling(taskId, apiKey, productId) {
    if (this.polling) {
      clearInterval(this.polling);
    }

    this.polling = setInterval(async () => {
      try {
        console.log('3. 변환 상태 확인 중...');
        const response = await axios.get(
          `https://api.meshy.ai/v1/image-to-3d/${taskId}`,
          { 
            headers: { Authorization: `Bearer ${apiKey}` }
          }
        );

        const { status, progress, model_urls } = response.data;
        console.log('변환 진행률:', progress + '%');

        if (status === 'SUCCEEDED' && progress === 100) {
          console.log('변환 완료. 모델 URL:', model_urls);
          
          try {
            console.log('4. 백엔드로 OBJ URL 전송');
            const uploadResponse = await uploadGoods3DImage(model_urls.obj);
            console.log('서버 응답:', uploadResponse);
            
            await updateSalesBoard(productId, {
              threeDimensionsGoodsImagePaths: uploadResponse
            });
            console.log('5. 상품 정보 업데이트 완료');

            this.stopPolling();
          } catch (error) {
            console.error('OBJ URL 처리 실패:', error);
            this.stopPolling();
          }
        } 
        
        if (status === 'FAILED') {
          console.error('3D 모델 변환 실패');
          this.stopPolling();
        }
      } catch (error) {
        console.error('상태 확인 중 오류:', error);
        this.stopPolling();
      }
    }, this.POLLING_INTERVAL);
  }

  stopPolling() {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
      console.log('폴링 종료');
    }
  }
}

export const backgroundConversionService = new BackgroundConversionService();