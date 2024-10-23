// app/policies/notice.js
export default function Notice() {
  return (
    <div className="container mx-auto p-6 bg-white rounded">
      <h1 className="text-3xl font-bold text-center mb-6">공지사항</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. 서비스 점검 안내</h2>
          <p className="text-base">
            (주)홈꾸는 보다 나은 서비스 제공을 위해 2024년 11월 1일 00시부터
            06시까지 서버 점검을 진행할 예정입니다. 점검 시간 동안 서비스 이용이
            일시적으로 중단될 수 있으니 양해 부탁드립니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. 신규 기능 업데이트</h2>
          <p className="text-base">
            2024년 12월 1일부터 고객 맞춤형 추천 기능이 추가됩니다. 이번
            업데이트를 통해 더 나은 쇼핑 경험을 제공할 수 있도록 노력하겠습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. 개인정보 처리방침 변경 안내
          </h2>
          <p className="text-base">
            개인정보 처리방침이 2024년 11월 15일부터 변경됩니다. 변경된 방침은
            당사 웹사이트에서 확인하실 수 있으며, 주요 변경 사항은 다음과
            같습니다:
          </p>
          <ul className="list-disc pl-5 text-base">
            <li>개인정보 보유 기간 변경</li>
            <li>쿠키 사용에 대한 명확한 설명 추가</li>
            <li>이용자 권리 강화 조치</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            4. 고객센터 운영 시간 변경
          </h2>
          <p className="text-base">
            2024년 12월 1일부터 고객센터 운영 시간이 평일 오전 9시에서 오후
            6시로 변경됩니다. 주말 및 공휴일에는 운영하지 않으니 이점 참고
            부탁드립니다.
          </p>
        </section>

        <p className="text-sm text-right">
          본 공지사항은 2024년 10월 23일에 작성되었습니다.
        </p>
      </div>
    </div>
  );
}
