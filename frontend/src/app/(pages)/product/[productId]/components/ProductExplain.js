import React,{useState,useEffect} from 'react'
import Product from '@/app/components/Product';
import Label from './Label';
import { categoryDetailMapping,statusMapping,moodMapping,tradeMethodMapping, sellStatusMapping } from './mapping';
import { preferenceList } from '@/app/api/userApi';
import { detailSalesBoard } from '@/app/api/productApi';

export default function ProductExplain({product}) {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await preferenceList();
        console.log('추천상품 목록:', response);
        
        // recommendations 배열이 있는지 확인
        if (response && response.recommendations && Array.isArray(response.recommendations)) {
          // 상위 4개의 추천 상품만 선택
          const top4Recommendations = response.recommendations.slice(0, 4);
          setRecommendations(top4Recommendations);

          // 4개의 상품에 대해서만 상세 정보 조회
          const recommendationDetails = await Promise.all(
            top4Recommendations.map(async (item) => {
              try {
                const detail = await detailSalesBoard(item.sales_board_id);
                return detail;
              } catch (error) {
                console.error(`상품 ${item.sales_board_id} 상세 정보 조회 실패:`, error);
                return null;
              }
            })
          );

          // null 값을 필터링하고 상태 업데이트
          const validProducts = recommendationDetails.filter(product => product !== null);
          setRecommendedProducts(validProducts);
        } else {
          console.error('추천 상품 데이터 형식이 올바르지 않습니다:', response);
        }
      } catch (error) {
        console.error('추천 상품 조회 실패:', error);
      }
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    console.log('현재 recommendations:', recommendations);
  }, [recommendations]);


  return (
    <div>
      <h1 className='text-normalText font-semibold text-[1.25rem]'>상품 정보</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <Label 
          type="category" 
          value={categoryDetailMapping[product.category]} 
        />
        <Label 
          type="status" 
          value={statusMapping[product.status]} 
        />
        <Label 
          type="mood" 
          value={moodMapping[product.mood]} 
        />
        <Label 
          type="tradeMethod" 
          value={tradeMethodMapping[product.tradeMethod]} 
        />
        <Label 
          type="isSell" 
          value={sellStatusMapping[product.isSell]} 
        />
      </div>
      <div className='w-full h-[1px] bg-greyButtonText my-4'></div>
      <p className='text-normalText text-[1rem] mb-4 whitespace-pre-wrap break-words'>
        {product.content}
      </p>
      <div className='w-full h-[1px] bg-greyButtonText my-4'></div>

      <h1 className='text-normalText font-semibold text-[1.25rem] mb-[1rem]'>추천 상품</h1>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        {recommendedProducts.map((product) => (
          <Product key={product.id} product={product} seller={product.seller}/>
        ))}
      </div>
    </div>
  )
}
