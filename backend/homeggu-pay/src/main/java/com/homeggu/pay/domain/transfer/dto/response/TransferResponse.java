package com.homeggu.pay.domain.transfer.dto.response;

import lombok.Getter;

@Getter
public class TransferResponse {
    private Long transferId;

    public TransferResponse(Long transferId) {
        this.transferId = transferId;
    }
}
