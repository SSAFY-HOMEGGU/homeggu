package com.homeggu.pay.domain.transfer.service;

import com.homeggu.pay.domain.charge.entity.HgMoney;
import com.homeggu.pay.domain.charge.repository.HgMoneyRepository;
import com.homeggu.pay.domain.transfer.dto.request.ConfirmRequest;
import com.homeggu.pay.domain.transfer.dto.request.TransferRequest;
import com.homeggu.pay.domain.transfer.entity.SafeTransfer;
import com.homeggu.pay.domain.transfer.entity.Transfer;
import com.homeggu.pay.domain.transfer.repository.SafeTransferRepository;
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
    private final SafeTransferRepository safeTransferRepository;
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
    public void createNormalTransfer(Long senderId, TransferRequest transferRequest) {
        Long transferAmount = transferRequest.getTransferAmount();
        HgMoney senderHgMoney = hgMoneyRepository.findByUserId(senderId).orElseThrow();
        HgMoney receiverHgMoney = hgMoneyRepository.findByUserId(transferRequest.getReceiverId()).orElseThrow();

        validateTransfer(transferAmount, senderHgMoney);

        senderHgMoney.decreaseBalance(transferAmount); // 송금자 잔액 감소
        receiverHgMoney.increaseBalance(transferAmount); // 수취자 잔액 증가

        // 송금 내역 생성
        Transfer transfer = Transfer.builder()
                .salesBoardId(transferRequest.getSalesBoardId())
                .senderId(senderId)
                .receiverId(transferRequest.getReceiverId())
                .transferAmount(transferAmount)
                .senderBalance(senderHgMoney.getHgMoneyBalance())
                .receiverBalance(receiverHgMoney.getHgMoneyBalance())
                .build();

        transferRepository.save(transfer);
    }

    @Override
    public void createSafeTransfer(Long senderId, TransferRequest transferRequest) {
        Long transferAmount = transferRequest.getTransferAmount();
        HgMoney senderHgMoney = hgMoneyRepository.findByUserId(senderId).orElseThrow();

        validateTransfer(transferAmount, senderHgMoney);

        senderHgMoney.decreaseBalance(transferAmount); // 송금자 잔액 감소

        // 송금 내역 생성
        Transfer transfer = Transfer.builder()
                .salesBoardId(transferRequest.getSalesBoardId())
                .senderId(senderId)
                .receiverId(transferRequest.getReceiverId())
                .transferAmount(transferAmount)
                .senderBalance(senderHgMoney.getHgMoneyBalance())
                .build(); // receiverBalance는 '안전송금 확인' 이후 업데이트

        // 안전송금 내역 생성
        SafeTransfer safeTransfer = SafeTransfer.builder()
                .transfer(transfer)
                .build();

        transferRepository.save(transfer);
        safeTransferRepository.save(safeTransfer);
    }

    @Override
    public void confirmSafePay(ConfirmRequest confirmRequest) {
        Long transferId = confirmRequest.getTransferId();

        Transfer transfer = transferRepository.findById(transferId).orElseThrow();
        SafeTransfer safeTransfer = safeTransferRepository.findById(transferId).orElseThrow();

        // 송금 내역에서 receiver_balance 업데이트
        HgMoney receiverHgMoney = hgMoneyRepository.findByUserId(transfer.getReceiverId()).orElseThrow();
        receiverHgMoney.increaseBalance(transfer.getTransferAmount());
        transfer.confirmSafePay(receiverHgMoney.getHgMoneyBalance());

        // 안전송금 내역 업데이트
        safeTransfer.confirm();
    }

}
