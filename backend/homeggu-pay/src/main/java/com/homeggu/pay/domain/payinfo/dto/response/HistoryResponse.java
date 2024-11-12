package com.homeggu.pay.domain.payinfo.dto.response;

import com.homeggu.pay.domain.payinfo.entity.HistoryCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class HistoryResponse {
    private HistoryCategory historyCategory; // charge(충전) or transfer(송금)
    private LocalDateTime createAt; // 충전/송금 일시
    private Long amount;            // 충전액(무조건 +) 또는 송금액(받은건 +, 보낸건 -)
    private Long balance;           // 충전 또는 송금 후의 홈꾸머니 잔액

    // '충전'의 경우만 사용
    private String accountNumber;
    private String bank;

    // '송금'의 경우만 사용
    private Long salesBoardId;
    private String title;
    private String counterpartyName; // 내가 송금받은 경우 '송금자'의 이름, 내가 송금한 경우 '수취자'의 이름

    // '안전송금'의 경우만 사용
    private String stateCategory;

    @Builder
    public HistoryResponse(HistoryCategory historyCategory, LocalDateTime createAt, Long amount, Long balance,
                              String accountNumber, String bank,
                              Long salesBoardId, String title, String counterpartyName,
                              String stateCategory) {
        this.historyCategory = historyCategory;
        this.createAt = createAt;
        this.amount = amount;
        this.balance = balance;
        this.accountNumber = accountNumber;
        this.bank = bank;
        this.salesBoardId = salesBoardId;
        this.title = title;
        this.counterpartyName = counterpartyName;
        this.stateCategory = stateCategory;
    }
}
