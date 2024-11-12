package com.homeggu.pay.domain.payinfo.repository;

import com.homeggu.pay.domain.charge.entity.Charge;
import com.homeggu.pay.domain.charge.entity.QCharge;
import com.homeggu.pay.domain.payinfo.dto.response.HistoryResponse;
import com.homeggu.pay.domain.payinfo.entity.HistoryCategory;
import com.homeggu.pay.domain.transfer.entity.*;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class PayInfoCustomRepository {

    private final JPAQueryFactory queryFactory;

    public Page<HistoryResponse> getHistory(Long userId, String filter, Pageable pageable) {
        List<HistoryResponse> historyList;

        if ("charge".equalsIgnoreCase(filter)) {
            historyList = getChargeHistory(userId);
        } else if ("transfer".equalsIgnoreCase(filter)) {
            historyList = getTransferHistory(userId);
        } else {
            historyList = getChargeHistory(userId);
            historyList.addAll(getTransferHistory(userId));
        }

        historyList.sort(Comparator.comparing(HistoryResponse::getCreateAt).reversed()); // 최신순 정렬

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), historyList.size());
        return new PageImpl<>(historyList.subList(start, end), pageable, historyList.size());
    }
    // [참고] 추후 성능 개선을 위해, 정렬 및 페이징 로직을 (메모리가 아니라) QueryDSL을 사용해 DB 레벨에서 수행하도록 변경 가능

    private List<HistoryResponse> getChargeHistory(Long userId) {
        QCharge charge = QCharge.charge;
        return queryFactory
                .selectFrom(charge)
                .where(charge.account.userId.eq(userId))
                .fetch()
                .stream()
                .map(this::convertCharge)
                .collect(Collectors.toList());
    }

    private List<HistoryResponse> getTransferHistory(Long userId) {
        QTransfer transfer = QTransfer.transfer;
        return queryFactory
                .selectFrom(transfer)
                .where(transfer.senderId.eq(userId).or(transfer.receiverId.eq(userId)))
                .fetch()
                .stream()
                .map(e -> convertTransfer(e, userId))
                .collect(Collectors.toList());
    }

    private HistoryResponse convertCharge(Charge charge) {
        return HistoryResponse.builder()
                .historyCategory(HistoryCategory.CHARGE)
                .createAt(charge.getCreateAt())
                .amount(charge.getChargeAmount())
                .balance(charge.getBalanceAfterCharge())
                .accountNumber(charge.getAccount().getAccountNumber())
                .bank(charge.getAccount().getBank())
                .build();
    }

    private HistoryResponse convertTransfer(Transfer transfer, Long userId) {
        return HistoryResponse.builder()
                .historyCategory(transfer.getStateCategory() == null ? HistoryCategory.NORMAL_TRANSFER : HistoryCategory.SAFE_TRANSFER)
                .createAt(transfer.getCreateAt())
                .amount(transfer.getSenderId() == userId ?
                        -1 * transfer.getTransferAmount() // 유저가 "송금자"인 경우, 내역에 "음수"로 기록
                        : transfer.getTransferAmount())   // 유저가 "수취자"인 경우, 내역에 "양수"로 기록
                .balance(transfer.getSenderId() == userId ?
                        transfer.getSenderBalance()       // 유저가 "송금자"인 경우, 내역에 송금 "보낸" 후의 잔액을 기록
                        : transfer.getReceiverBalance())  // 유저가 "수취자"인 경우, 내역에 송금 "받은" 후의 잔액을 기록
                .salesBoardId(transfer.getSalesBoardId())
//                .title()            // MSA 설정 후 salesBoardId를 활용해 참조
//                .counterpartyName() // MSA 설정 후 userId를 활용해 참조
                .stateCategory(transfer.getStateCategory() == null ? null : transfer.getStateCategory().toString())
                .build();
    }

}
