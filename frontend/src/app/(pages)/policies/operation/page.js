export default function OperationPolicy() {
  return (
    <div className="container mx-auto p-6 bg-white rounded">
      <h1 className="text-3xl font-bold text-center mb-6">운영정책</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. 운영의 목적</h2>
          <p className="text-base">
            본 운영정책은 (주)홈꾸(이하 "회사")의 서비스 제공 과정에서 발생할 수
            있는 문제를 공정하고 일관되게 처리하기 위한 지침을 명시합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. 회원의 권리와 의무</h2>
          <p className="text-base">
            회원은 회사의 정책 및 운영 지침을 준수할 의무가 있으며, 서비스를
            통해 다른 회원이나 회사를 해치는 행위를 해서는 안 됩니다. 회원은
            언제든지 본인의 개인정보를 열람, 수정, 삭제할 수 있는 권리가
            있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. 서비스 이용 제한</h2>
          <p className="text-base">
            회사는 회원이 다음과 같은 행위를 할 경우 사전 통보 없이 서비스
            이용을 제한할 수 있습니다.
            <br />
            1. 법령을 위반하는 행위
            <br />
            2. 타인의 권리를 침해하거나 명예를 훼손하는 행위
            <br />
            3. 공공질서 및 미풍양속을 해치는 행위
            <br />
            4. 서비스의 정상적인 운영을 방해하는 행위
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. 분쟁 해결</h2>
          <p className="text-base">
            회원 간 또는 회원과 회사 간의 분쟁 발생 시, 회사는 공정하고 신속하게
            이를 해결하기 위해 노력하며, 필요시 관련 법령에 따라 법적 절차를
            진행할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. 정책의 변경</h2>
          <p className="text-base">
            본 운영정책은 회사의 사정에 따라 변경될 수 있으며, 변경 시 회원에게
            사전 공지합니다. 변경된 운영정책은 공지된 날로부터 효력이
            발생합니다.
          </p>
        </section>

        <p className="text-sm text-right">
          본 운영정책은 2024년 10월 23일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
