package com.homeggu.pay.domain.charge.service;

import com.homeggu.pay.domain.charge.dto.request.ChargeRequest;

public interface ChargeService {
    void createCharge(Long userId, ChargeRequest chargeRequest);
}
