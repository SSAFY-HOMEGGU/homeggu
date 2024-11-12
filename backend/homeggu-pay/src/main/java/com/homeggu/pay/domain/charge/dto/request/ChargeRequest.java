package com.homeggu.pay.domain.charge.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChargeRequest {
    private Long chargeAmount; // 충전 금액
}
