package com.homeggu.pay.domain.payinfo.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class HgMoneyInfoResponse {
    private Long hgMoneyBalance;
    private String accountNumber;
    private String bank;

    @Builder
    public HgMoneyInfoResponse(Long hgMoneyBalance, String accountNumber, String bank) {
        this.hgMoneyBalance = hgMoneyBalance;
        this.accountNumber = accountNumber;
        this.bank = bank;
    }
}
