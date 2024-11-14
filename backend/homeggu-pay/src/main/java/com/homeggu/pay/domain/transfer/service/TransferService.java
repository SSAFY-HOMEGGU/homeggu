package com.homeggu.pay.domain.transfer.service;

import com.homeggu.pay.domain.transfer.dto.request.CancelRequest;
import com.homeggu.pay.domain.transfer.dto.request.ConfirmRequest;
import com.homeggu.pay.domain.transfer.dto.request.TransferRequest;
import com.homeggu.pay.domain.transfer.dto.response.TransferResponse;

public interface TransferService {
    TransferResponse createTransfer(Long senderId, TransferRequest transferRequest);

    void confirmSafePay(ConfirmRequest confirmRequest);

    void cancelSafePay(CancelRequest cancelRequest);
}
