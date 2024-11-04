package com.homeggu.pay.domain.transfer.service;

import com.homeggu.pay.domain.transfer.dto.request.TransferRequest;

public interface TransferService {
    void createNormalTransfer(Long senderId, TransferRequest transferRequest);

    void createSafeTransfer(Long senderId, TransferRequest transferRequest);
}
