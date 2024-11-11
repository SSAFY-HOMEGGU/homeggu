package com.homeggu.pay.domain.transfer.service;

import com.homeggu.pay.domain.charge.entity.HgMoney;
import com.homeggu.pay.domain.charge.repository.HgMoneyRepository;
import com.homeggu.pay.domain.transfer.dto.request.CancelRequest;
import com.homeggu.pay.domain.transfer.dto.request.ConfirmRequest;
import com.homeggu.pay.domain.transfer.dto.request.TransferRequest;
import com.homeggu.pay.domain.transfer.entity.StateCategory;
import com.homeggu.pay.domain.transfer.entity.Transfer;
import com.homeggu.pay.domain.transfer.repository.TransferRepository;
import com.homeggu.pay.global.exception.custom.HgMoneyBalanceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class TransferServiceImpl implements TransferService {

    private final TransferRepository transferRepository;
    private final HgMoneyRepository hgMoneyRepository;

    private void validateTransfer(Long transferAmount, HgMoney senderHgMoney) {
        // 잘못된 입력값
        if (transferAmount <= 0) {
            throw new IllegalArgumentException("Charge amount must be positive.");
        }

        // 송금자 머니 잔액 부족
        if (senderHgMoney.getHgMoneyBalance() < transferAmount) {
            throw new HgMoneyBalanceException();
        }
    }

    @Override
    public void createTransfer(Long senderId, TransferRequest transferRequest) {
        Long transferAmount = transferRequest.getTransferAmount();
        HgMoney senderHgMoney = hgMoneyRepository.findByUserId(senderId).orElseThrow();
        HgMoney receiverHgMoney = hgMoneyRepository.findByUserId(transferRequest.getReceiverId()).orElseThrow();

        validateTransfer(transferAmount, senderHgMoney);

        senderHgMoney.decreaseBalance(transferAmount); // 송금자 잔액 감소

        if (!transferRequest.isSafePay()) { // 안전송금이 아닌 경우만, 즉시 수취자 잔액 증가
            receiverHgMoney.increaseBalance(transferAmount);
        }

        // 송금 내역 생성
        Transfer transfer = Transfer.builder()
                .salesBoardId(transferRequest.getSalesBoardId())
                .senderId(senderId)
                .receiverId(transferRequest.getReceiverId())
                .transferAmount(transferAmount)
                .senderBalance(senderHgMoney.getHgMoneyBalance())
                .receiverBalance(transferRequest.isSafePay() ? null : receiverHgMoney.getHgMoneyBalance()) // 안전송금의 경우 확정 후 업데이트
                .stateCategory(transferRequest.isSafePay() ? StateCategory.PENDING : null)
                .build();

        transferRepository.save(transfer);
    }

    @Override
    public void confirmSafePay(ConfirmRequest confirmRequest) {
        Transfer transfer = transferRepository.findById(confirmRequest.getTransferId()).orElseThrow();
        HgMoney receiverHgMoney = hgMoneyRepository.findByUserId(transfer.getReceiverId()).orElseThrow();

        if (!transfer.getStateCategory().equals(StateCategory.PENDING)) {
            throw new IllegalStateException("Transfer is not in a pending state and cannot be confirmed.");
        }

        receiverHgMoney.increaseBalance(transfer.getTransferAmount()); // 수취자 홈꾸머니 잔액 증가
        transfer.confirm(receiverHgMoney.getHgMoneyBalance()); // 안전송금 확정
    }

    @Override
    public void cancelSafePay(CancelRequest cancelRequest) {
        Transfer transfer = transferRepository.findById(cancelRequest.getTransferId()).orElseThrow();
        HgMoney senderHgMoney = hgMoneyRepository.findByUserId(transfer.getSenderId()).orElseThrow();

        System.out.println(transfer.getStateCategory());

        if (!transfer.getStateCategory().equals(StateCategory.PENDING)) {
            throw new IllegalStateException("Transfer is not in a pending state and cannot be cancelled.");
        }

        senderHgMoney.increaseBalance(transfer.getTransferAmount()); // 송금자 홈꾸머니 잔액 원상복구
        transfer.cancel(); // 안전송금 취소
    }

}
