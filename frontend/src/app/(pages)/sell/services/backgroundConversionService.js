
// [ver1. 직접 obj 파일 다운 받기]

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










// [ver2. 다운 받을 obj 파일 backend에 보내기]

// import axios from 'axios';
// import { salesBoard, uploadGoods3DImage, updateSalesBoard } from '@/app/api/productApi';

// class BackgroundConversionService {
//   constructor() {
//     this.polling = null;
//     this.POLLING_INTERVAL = 3000;
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

//   startPolling(taskId, apiKey, productId) {
//     if (this.polling) {
//       clearInterval(this.polling);
//     }

//     this.polling = setInterval(async () => {
//       try {
//         console.log('3. 변환 상태 확인 중...');
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
          
//           try {
//             console.log('4. 백엔드로 OBJ URL 전송');
//             const uploadResponse = await uploadGoods3DImage(model_urls.obj);
//             console.log('서버 응답:', uploadResponse);
            
//             await updateSalesBoard(productId, {
//               threeDimensionsGoodsImagePaths: uploadResponse
//             });
//             console.log('5. 상품 정보 업데이트 완료');

//             this.stopPolling();
//           } catch (error) {
//             console.error('OBJ URL 처리 실패:', error);
//             this.stopPolling();
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
//       console.log('폴링 종료');
//     }
//   }
// }

// export const backgroundConversionService = new BackgroundConversionService();







// [ver3. (store 사용x) 사용자가 직접 3d 이미지 업로드하기]

// import axios from 'axios';
// import { toast } from 'react-toastify'; 
// import ModelReadyModal from './ModelReadyModal';
// import { salesBoard, uploadGoods3DImage, updateSalesBoard, uploadGoodsImage } from '@/app/api/productApi';

// class BackgroundConversionService {
//   constructor() {
//     this.polling = null;
//     this.POLLING_INTERVAL = 3000;
//     this.onModelReady = null;
//     this.progressToastId = null;
//   }

//   setModelReadyCallback(callback) {
//     this.onModelReady = callback;
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
      
//       this.progressToastId = toast('3D 변환 시작...', {
//         autoClose: false,
//         closeButton: false,
//         draggable: false,
//         closeOnClick: false,
//         progress: 0,
//         position: 'bottom-left'
//       });
      
//       this.startPolling(taskId, MESHY_API_KEY, productId);
//       return taskId;
//     } catch (error) {
//       console.error('에러 발생:', error);
//       throw error;
//     }
//   }

//   startPolling(taskId, apiKey, productId) {
//     if (this.polling) {
//       clearInterval(this.polling);
//     }

//     this.polling = setInterval(async () => {
//       try {
//         console.log('3. 변환 상태 확인 중...');
//         const response = await axios.get(
//           `https://api.meshy.ai/v1/image-to-3d/${taskId}`,
//           { 
//             headers: { Authorization: `Bearer ${apiKey}` }
//           }
//         );

//         const { status, progress, model_urls } = response.data;
//         console.log('변환 진행률:', progress + '%');
        
//         if (this.progressToastId) {
//           toast.update(this.progressToastId, {
//             render: `3D 변환 진행률: ${progress}%`,
//             progress: progress / 100,
//             position: 'bottom-left'
//           });
//         }

//         if (status === 'SUCCEEDED' && progress === 100) {
//           console.log('변환 완료. 모델 URL:', model_urls);
          
//           if (this.progressToastId) {
//             toast.update(this.progressToastId, {
//               render: "3D 변환 완료!",
//               type: 'success',
//               autoClose: 3000,
//               progress: 1,
//               position: 'bottom-left'
//             });
//             this.progressToastId = null;
//           }
          
//           if (this.onModelReady) {
//             this.onModelReady({
//               objUrl: model_urls.obj,
//               productId: productId,
//               onUploadComplete: async (uploadedFile) => {
//                 try {
//                   const uploadToastId = toast.loading('파일 업로드 중...', {
//                     closeOnClick: false,
//                     closeButton: false,
//                     draggable: false,
//                     position: 'bottom-left'
//                   });
                  
//                   const uploadResponse = await uploadGoodsImage(uploadedFile);
                  
//                   await updateSalesBoard(productId, {    
//                     threeDimensionsGoodsImagePaths: uploadResponse
//                   });

//                   toast.update(uploadToastId, {
//                     render: '상품 정보가 업데이트되었습니다.',
//                     type: 'success',
//                     autoClose: 3000,
//                     isLoading: false,
//                     position: 'bottom-left'
//                   });
//                 } catch (error) {
//                   toast.error('파일 업로드 실패: ' + error.message, {
//                     position: 'bottom-left'
//                   });
//                 }
//               }
//             });
//           }

//           this.stopPolling();
//         } 
        
//         if (status === 'FAILED') {
//           console.error('3D 모델 변환 실패');
//           if (this.progressToastId) {
//             toast.update(this.progressToastId, {
//               render: "3D 변환 실패",
//               type: 'error',
//               autoClose: 3000,
//               position: 'bottom-left'
//             });
//             this.progressToastId = null;
//           }
//           this.stopPolling();
//         }
//       } catch (error) {
//         console.error('상태 확인 중 오류:', error);
//         if (this.progressToastId) {
//           toast.update(this.progressToastId, {
//             render: "변환 중 오류 발생",
//             type: 'error',
//             autoClose: 3000,
//             position: 'bottom-left'
//           });
//           this.progressToastId = null;
//         }
//         this.stopPolling();
//       }
//     }, this.POLLING_INTERVAL);
//   }

//   stopPolling() {
//     if (this.polling) {
//       clearInterval(this.polling);
//       this.polling = null;
//       console.log('폴링 종료');
//     }
//   }
// }

// export const backgroundConversionService = new BackgroundConversionService();




// [ver4. (store 사용) 사용자가 직접 3d 이미지 업로드하기]

import axios from 'axios';
import { toast } from 'react-toastify'; 
import ModelReadyModal from './ModelReadyModal';
import { salesBoard, uploadGoods3DImage, updateSalesBoard, uploadGoodsImage } from '@/app/api/productApi';
import useProductStore from '@/app/store/useProductStore';

class BackgroundConversionService {
  constructor() {
    this.polling = null;
    this.POLLING_INTERVAL = 3000;
    this.onModelReady = null;
    this.progressToastId = null;
  }

  setModelReadyCallback(callback) {
    this.onModelReady = callback;
  }

  async startConversion(mainImageUrl) {
    const MESHY_API_KEY = 'msy_99FYmmosDk1oyIcQMZfGGBgn2VwokDVv6D5L';

    try {
      // store에서 데이터 가져오기
      // const store = useProductStore.getState();

      // const formData = {
      //   salesBoardDTO: {
      //     ...store.salesBoardDTO,
      //     price: Number(store.salesBoardDTO.price) || 0,
      //     deliveryPrice: Number(store.salesBoardDTO.deliveryPrice) || 0,
      //     goods_x: Number(store.salesBoardDTO.goods_x) || 0,
      //     goods_y: Number(store.salesBoardDTO.goods_y) || 0,
      //     goods_z: Number(store.salesBoardDTO.goods_z) || 0
      //   },
      //   goodsImagePaths: useProductStore.getState().goodsImagePaths,
      //   threeDimensionsGoodsImagePaths: useProductStore.getState().threeDimensionsGoodsImagePaths
      // };

      // store에서 데이터 가져오기
      const store = useProductStore.getState();
      
      // mood 필드를 제외한 salesBoardDTO 구성
      const { isSell, ...salesBoardDTOWithoutisSell } = store.salesBoardDTO;
      
      // 요청 데이터 구조화
      const formData = {
        salesBoardDTO: {
          ...salesBoardDTOWithoutisSell,
          price: Number(salesBoardDTOWithoutisSell.price) || 0,
          deliveryPrice: Number(salesBoardDTOWithoutisSell.deliveryPrice) || 0,
          goods_x: Number(salesBoardDTOWithoutisSell.goods_x) || 0,
          goods_y: Number(salesBoardDTOWithoutisSell.goods_y) || 0,
          goods_z: Number(salesBoardDTOWithoutisSell.goods_z) || 0
        },
        goodsImagePaths: store.goodsImagePaths,
        threeDimensionsGoodsImagePaths: store.threeDimensionsGoodsImagePaths
      };
  
      console.log('요청 데이터:', formData);
      
      // const productResponse = await salesBoard(requestData)

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
      
      this.progressToastId = toast('3D 변환 시작...', {
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
        progress: 0,
        position: 'bottom-left'
      });
      
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
        
        if (this.progressToastId) {
          toast.update(this.progressToastId, {
            render: `3D 변환 진행률: ${progress}%`,
            progress: progress / 100,
            position: 'bottom-left'
          });
        }

        if (status === 'SUCCEEDED' && progress === 100) {
          console.log('변환 완료. 모델 URL:', model_urls);
          
          if (this.progressToastId) {
            toast.update(this.progressToastId, {
              render: "3D 변환 완료!",
              type: 'success',
              autoClose: 3000,
              progress: 1,
              position: 'bottom-left'
            });
            this.progressToastId = null;
          }
          
          // if (this.onModelReady) {
          //   this.onModelReady({
          //     objUrl: model_urls.obj,
          //     productId: productId,
          //     onUploadComplete: async (uploadedFile) => {
          //       try {
          //         const uploadToastId = toast.loading('파일 업로드 중...', {
          //           closeOnClick: false,
          //           closeButton: false,
          //           draggable: false,
          //           position: 'bottom-left'
          //         });
                  
          //         await updateSalesBoard(productId, {    
          //           threeDimensionsGoodsImagePaths: uploadedFile
          //         });

          //         toast.update(uploadToastId, {
          //           render: '상품 정보가 업데이트되었습니다.',
          //           type: 'success',
          //           autoClose: 3000,
          //           isLoading: false,
          //           position: 'bottom-left'
          //         });
          //       } catch (error) {
          //         toast.error('파일 업로드 실패: ' + error.message, {
          //           position: 'bottom-left'
          //         });
          //       }
          //     }
          //   });
          // }
          if (this.onModelReady) {
            // objUrl과 productId만 전달
            this.onModelReady({
              objUrl: model_urls.obj,
              productId: productId
            });
          }

          this.stopPolling();
        } 
        
        if (status === 'FAILED') {
          console.error('3D 모델 변환 실패');
          if (this.progressToastId) {
            toast.update(this.progressToastId, {
              render: "3D 변환 실패",
              type: 'error',
              autoClose: 3000,
              position: 'bottom-left'
            });
            this.progressToastId = null;
          }
          this.stopPolling();
        }
      } catch (error) {
        console.error('상태 확인 중 오류:', error);
        if (this.progressToastId) {
          toast.update(this.progressToastId, {
            render: "변환 중 오류 발생",
            type: 'error',
            autoClose: 3000,
            position: 'bottom-left'
          });
          this.progressToastId = null;
        }
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