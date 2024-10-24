// app/policies/terms.js
export default function Terms() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">이용약관</h1>

      <p className="text-lg mb-4">
        본 이용약관은 사용자가 당사 서비스를 이용하는 데 있어 준수해야 할 조건
        및 절차를 규정합니다.
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">제 1 조 (목적)</h2>
          <p className="text-base">
            이 약관은 (주)홈꾸(이하 "회사")가 제공하는
            종합중고거래가구쇼핑플랫폼 서비스(이하 "서비스")를 이용함에 있어
            회사와 이용자의 권리, 의무, 책임 사항 및 이용 조건 등을 규정함을
            목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">제 2 조 (정의)</h2>
          <p className="text-base">
            1. "서비스"라 함은 회사가 제공하는 모든 온라인 플랫폼을 말합니다.
            <br />
            2. "이용자"라 함은 회사의 서비스를 이용하는 모든 개인 또는 법인을
            말합니다.
            <br />
            3. "계정"이라 함은 이용자가 서비스에 접속하기 위해 사용하는 고유의
            아이디와 비밀번호를 말합니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            제 3 조 (약관의 효력 및 변경)
          </h2>
          <p className="text-base">
            1. 이 약관은 이용자가 서비스에 가입할 때 동의한 후 효력이
            발생합니다.
            <br />
            2. 회사는 필요한 경우 이 약관을 변경할 수 있으며, 변경된 약관은 7일
            전부터 공지됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            제 4 조 (이용자의 의무)
          </h2>
          <p className="text-base">
            1. 이용자는 본 약관 및 관계 법령을 준수해야 하며, 회사의 서비스
            운영에 방해되는 행위를 하지 않아야 합니다.
            <br />
            2. 이용자는 본인의 계정 관리 책임을 지며, 제3자가 이를 무단으로
            사용하지 않도록 해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            제 5 조 (서비스 이용 제한)
          </h2>
          <p className="text-base">
            회사는 다음과 같은 경우 이용자의 서비스 이용을 제한할 수 있습니다.
            <br />
            1. 법령 또는 본 약관을 위반한 경우
            <br />
            2. 타인의 권리를 침해하거나 명예를 훼손한 경우
            <br />
            3. 공공질서 및 미풍양속에 반하는 행위를 한 경우
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">제 6 조 (책임의 한계)</h2>
          <p className="text-base">
            회사는 천재지변, 전쟁, 테러 등의 불가항력적인 사유로 인한 서비스
            중단에 대해 책임을 지지 않습니다. 또한, 이용자가 게재한 정보, 자료,
            사실의 신뢰도, 정확성 등에 대해서도 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            제 7 조 (준거법 및 재판 관할)
          </h2>
          <p className="text-base">
            이 약관은 대한민국 법률에 따라 해석되며, 회사와 이용자 간에 발생한
            분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원을 제1심
            관할법원으로 합니다.
          </p>
        </section>

        <p className="text-sm text-right">
          본 약관은 2024년 1월 1일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
