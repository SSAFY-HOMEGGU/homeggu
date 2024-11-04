package com.homeggu.pay.domain.transfer.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TransferRequest {

    private Long salesBoardId;

    private Long receiverId;

    private Long transferAmount;

    private boolean safePay; // 안전송금 여부

}
