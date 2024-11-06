package com.homeggu.pay.domain.payinfo.service;

import com.homeggu.pay.domain.payinfo.dto.response.HgMoneyInfoResponse;
import com.homeggu.pay.domain.payinfo.dto.response.HistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PayInfoService {
    HgMoneyInfoResponse getHgMoneyInfo(Long userId);

    Page<HistoryResponse> getHistory(Long userId, String filter, Pageable pageable);
}
