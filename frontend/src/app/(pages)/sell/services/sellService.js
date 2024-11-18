import axios from 'axios';
import useProductStore from '@/app/store/useProductStore';

class SellService {
  constructor() {
    this.MESHY_API_KEY = 'msy_99FYmmosDk1oyIcQMZfGGBgn2VwokDVv6D5L';
  }
  getInitialFormData() {
    return {
      salesBoardDTO: {
        title: '',
        content: '',
        category: 'BED',
        mood: 'WOOD_VINTAGE',
        status: '',
        tradeMethod: '',
        isSafe: false,
        hopeLocation: '',
        price: 0,
        deliveryPrice: 0,
        goods_x: 0,
        goods_y: 0,
        goods_z: 0
      },
      goodsImagePaths: [],
      threeDimensionsGoodsImagePaths: []
    };
  }

  validateForm(formData) {
    const salesDTO = formData.salesBoardDTO;
    
    const baseFieldsValid = 
      salesDTO.title !== '' &&
      salesDTO.content !== '' &&
      salesDTO.category !== '' &&
      salesDTO.status !== '' &&
      salesDTO.price > 0 &&
      formData.goodsImagePaths.length > 0;

    const sizeValid = 
      salesDTO.goods_x > 0 &&
      salesDTO.goods_y > 0 &&
      salesDTO.goods_z > 0;

    const tradeMethodValid = salesDTO.tradeMethod !== '';
    const directTradeValid = salesDTO.tradeMethod !== 'IN_PERSON' || salesDTO.hopeLocation !== '';
    const deliveryValid = salesDTO.tradeMethod !== 'DELIVERY' || salesDTO.deliveryPrice >= 0;

    return baseFieldsValid && sizeValid && tradeMethodValid && directTradeValid && deliveryValid;
  }

  async submitProduct(finalFormData) {
    try {
      await salesBoard(finalFormData);
    } catch (error) {
      throw new Error('상품 등록에 실패했습니다.');
    }
  }
}

export const sellService = new SellService();