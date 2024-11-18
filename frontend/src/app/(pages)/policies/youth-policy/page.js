// app/policies/youth-policy.js
export default function YouthPolicy() {
  return (
    <div className="container mx-auto p-6 bg-white rounded">
      <h1 className="text-3xl font-bold text-center mb-6">청소년보호정책</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. 청소년 보호의 목적</h2>
          <p className="text-base">
            (주)홈꾸(이하  &quot;회사 &quot;)는 청소년이 유해한 정보로부터 보호받으며,
            안전하고 건전한 인터넷 환경을 제공받을 수 있도록 청소년 보호정책을
            시행합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. 유해정보에 대한 관리
          </h2>
          <p className="text-base">
            회사는 청소년에게 유해한 정보를 차단하고, 유해정보의 유통을 방지하기
            위해 지속적으로 모니터링을 실시하며, 관련 법규를 준수합니다. 청소년
            보호를 위해 필터링 시스템을 사용하여 유해 콘텐츠를 차단하고
            있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. 청소년 보호를 위한 교육
          </h2>
          <p className="text-base">
            회사는 임직원 및 서비스 제공자를 대상으로 청소년 보호에 대한 인식과
            책임을 고취시키기 위해 정기적인 교육을 실시하고 있습니다. 이를 통해
            청소년 보호를 위한 정책이 일관되게 적용될 수 있도록 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            4. 청소년 유해 매체물 신고 제도
          </h2>
          <p className="text-base">
            회사는 청소년이 유해한 정보에 노출되었을 경우 이를 신속하게 처리하기
            위한 신고 제도를 운영하고 있습니다. 이용자는 언제든지 유해 정보를
            신고할 수 있으며, 회사는 이를 빠르게 처리합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. 정책의 개정 및 공지</h2>
          <p className="text-base">
            본 청소년보호정책은 법령 또는 회사 방침에 따라 변경될 수 있으며,
            변경된 내용은 사전에 공지됩니다. 변경된 정책은 공지된 날로부터
            효력이 발생합니다.
          </p>
        </section>

        <p className="text-sm text-right">
          본 청소년보호정책은 2024년 10월 23일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
