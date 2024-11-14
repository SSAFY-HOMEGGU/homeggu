import React,{useState,useEffect} from 'react'
import { BlueButton,WhiteButton } from '@/app/components/Button'
import Image from 'next/image'
import { transferConfirm, transferCancel } from '@/app/api/payApi';
import { getChatHistory } from '@/app/api/chatApi';

export default function PurchaseConfirmMessage ({ chatRoomId, onConfirm, onCancel }) {
  const [transferId, setTransferId] = useState(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        // 최근 채팅 내역 조회 (recent 파라미터는 필요에 따라 조정)
        const chatHistory = await getChatHistory(chatRoomId);
        console.log('chatHistory',chatHistory)
        // 채팅 내역에서 구매확정 메시지 찾기
        const purchaseMessage = chatHistory.find(message => 
          typeof message.message === 'string' && 
          message.message.startsWith("메시지_구매확정_")
        );

        if (purchaseMessage) {
          // transferId 추출 (메시지_구매확정_123 형식에서 123 추출)
          const extractedTransferId = purchaseMessage.message.split("메시지_구매확정_")[1];
          const numericTransferId = Number(extractedTransferId);
          if (extractedTransferId) {
            setTransferId(prev => {
              console.log('이전 transferId:', prev);
              console.log('새로운 transferId:', numericTransferId);
              return numericTransferId;
            });
          }
        }
      } catch (error) {
        console.error("채팅 내역 조회 중 오류 발생:", error);
      }
    };

    fetchChatHistory();
  }, [chatRoomId]);


  const handleConfirm = async () => {
    try {
      console.log("구매 확정 처리 시작");
      console.log('구매 아이디',transferId)
      const response = await transferConfirm({ transferId });
      
      if(response) {
        console.log("구매 확정 처리 완료:", response);
        alert("구매가 확정되었습니다.");
      }
    } catch (error) {
      console.error("구매 확정 처리 중 오류 발생:", error);
      alert("구매 확정 처리 중 오류가 발생했습니다.");
    }
  };
 
  const handleCancel = async () => {
    try {
      console.log("구매 취소 처리 시작");
      const response = await transferCancel({ transferId});

      if(response) {
        console.log("구매 취소 처리 완료:", response);
        alert("구매가 취소되었습니다.");
      }
    } catch (error) {
      console.error("구매 취소 처리 중 오류 발생:", error);
      alert("구매 취소 처리 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <div className='border border-greyButtonText rounded-[10px]'>
      <div className='flex justify-between items-start bg-[#E2F3FF] p-5 rounded-t-[10px]'>
        <h2 className='font-tmoney font-bold text-normalText text-[1.8rem]'>구매 확정</h2>
        <div className='flex flex-col gap-8'>
          <span className='font-tmoney font-bold text-greyButtonText pt-2'>홈꾸Pay</span>
          <Image 
            src='/icons/chatTemplate.svg'
            alt='채팅 아이콘'
            width={40}
            height={40}
            className='mt-10'
          />
        </div>
      </div>
      <div className='px-5 pb-5'> 
        <div className='mt-5 text-normalText'>
          <p>안전거래 상품입니다.</p>
          <p>구매 확정 시 판매자에게 금액이 보내집니다</p>
          <p>구매 확정 버튼을 눌러주세요</p>
        </div>
        <div className='flex justify-center gap-3 mt-5'>
          <BlueButton
            width='w-[8rem]'
            height='h-[2.5rem]'
            text="text-[1rem]" 
            rounded="rounded-[10px]"
            onClick={handleConfirm}
          >
            구매 확정
          </BlueButton>
          <WhiteButton
            width='w-[8rem]'
            height='h-[2.5rem]'
            text="text-[1rem]" 
            rounded="rounded-[10px]"
            onClick={handleCancel}
          >
            구매 취소
          </WhiteButton>
        </div>
      </div>
    </div>
  )
}

