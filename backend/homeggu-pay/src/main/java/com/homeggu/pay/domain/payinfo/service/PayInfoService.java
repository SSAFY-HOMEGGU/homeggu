package com.homeggu.pay.domain.payinfo.service;

import com.homeggu.pay.domain.payinfo.dto.response.HgMoneyInfoResponse;

public interface PayInfoService {
    HgMoneyInfoResponse getHgMoneyInfo(Long userId);
}
