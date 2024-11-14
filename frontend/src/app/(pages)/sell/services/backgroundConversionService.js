

import axios from 'axios';
import { salesBoard, uploadGoods3DImage, updateSalesBoard } from '@/app/api/productApi';

class BackgroundConversionService {
  constructor() {
    this.polling = null;
    this.POLLING_INTERVAL = 3000;
    this.MAX_RETRIES = 3;
    this.retryCount = 0;
  }

  // 1. 상품 등록 및 3D 변환 시작
  async startConversion(mainImageUrl, formData) {
    const MESHY_API_KEY = 'msy_99FYmmosDk1oyIcQMZfGGBgn2VwokDVv6D5L';

    try {
      const productResponse = await salesBoard(formData);
      const productId = productResponse.id;
  
      // 이미지를 fetch로 가져오기
      const imageResponse = await fetch(mainImageUrl);
      const blob = await imageResponse.blob();
      const reader = new FileReader();
      
      const base64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
  
      const meshyResponse = await axios.post(
        'https://api.meshy.ai/v1/image-to-3d',
        {
          image_url: base64,
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
      this.startPolling(taskId, MESHY_API_KEY, productId);
      return taskId;
    } catch (error) {
      console.error('상품 등록 또는 3D 모델 변환 시작 실패:', error);
      throw error;
    }
  }

  // 2. 변환된 3D 모델 다운로드
  async download3DModel(modelUrl) {
    try {
      const response = await axios.get(modelUrl, {
        responseType: 'blob'
      });
      
      const file = new File([response.data], 'model.glb', { 
        type: 'model/gltf-binary' 
      });
      
      return file;
    } catch (error) {
      console.error('3D 모델 다운로드 실패:', error);
      throw error;
    }
  }

  // 3. 변환 상태 확인 및 처리
  startPolling(taskId, apiKey, productId) {
    if (this.polling) {
      clearInterval(this.polling);
    }

    this.polling = setInterval(async () => {
      try {
        const response = await axios.get(
          `https://api.meshy.ai/v1/image-to-3d/${taskId}`,
          { 
            headers: { Authorization: `Bearer ${apiKey}` }
          }
        );

        const { status, progress, model_urls } = response.data;
        console.log('3D 변환 진행률:', progress);

        if (status === 'SUCCEEDED' && progress === 100) {
          if (this.retryCount >= this.MAX_RETRIES) {
            console.log('최대 재시도 횟수 도달');
            this.stopPolling();
            return;
          }

          try {
            // 3D 모델 다운로드
            const modelFile = await this.download3DModel(model_urls.glb);
            // 서버에 3D 모델 업로드
            const uploadResponse = await uploadGoods3DImage([modelFile]);
            // 상품 정보 업데이트
            await updateSalesBoard(productId, {
              threeDimensionsGoodsImagePaths: uploadResponse
            });

            console.log('3D 모델 처리 완료');
            this.stopPolling();
          } catch (error) {
            console.error('3D 모델 처리 실패:', error);
            this.retryCount++;
          }
        } 
        
        if (status === 'FAILED') {
          console.error('3D 모델 변환 실패');
          this.stopPolling();
        }
      } catch (error) {
        console.error('3D 모델 변환 상태 확인 중 오류:', error);
        this.stopPolling();
      }
    }, this.POLLING_INTERVAL);
  }

  // 4. 폴링 중지 및 초기화
  stopPolling() {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
      this.retryCount = 0;
    }
  }
}

export const backgroundConversionService = new BackgroundConversionService();