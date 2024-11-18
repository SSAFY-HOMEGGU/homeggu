import React from 'react'
import Product from '@/app/components/Product';
import Label from './Label';
import { categoryDetailMapping,statusMapping,moodMapping,tradeMethodMapping, sellStatusMapping } from './mapping';
import { preferenceList } from '@/app/api/userApi';

export default function ProductExplain({product}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // const products = [
  //   {
  //     id: 1,
  //     name: "상품 이름 1",
  //     price: "50,000",
  //     date: "2024-10-01",
  //     imageUrl: ["/images/bed2.png","/images/bed3.png"],
  //     seller: true
  //   },
  //   {
  //     id: 2,
  //     name: "상품 이름 2",
  //     price: "30,000",
  //     date: "2024-10-02",
  //     imageUrl: ["/images/bed2.png","/images/bed3.png"],
  //     seller: true
  //   },
  //   {
  //     id: 3,
  //     name: "상품 이름 1",
  //     price: "50,000",
  //     date: "2024-10-01",
  //     imageUrl: ["/images/bed2.png","/images/bed3.png"],
  //     seller: true
  //   },
  //   {
  //     id: 4,
  //     name: "상품 이름 2",
  //     price: "30,000",
  //     date: "2024-10-02",
  //     imageUrl: ["/images/bed2.png","/images/bed3.png"],
  //     seller: true
  //   },
  // ];

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await preferenceList();
        setRecommendations(response); // API 응답 데이터로 상태 업데이트
      } catch (error) {
        console.error('추천 상품 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);



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
        {recommendations.map((product) => (
          <Product key={product.id} product={product} seller={product.seller}/>
        ))}
      </div>
    </div>
  )
}
