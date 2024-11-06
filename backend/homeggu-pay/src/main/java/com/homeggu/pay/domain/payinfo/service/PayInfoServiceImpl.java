package com.homeggu.pay.domain.payinfo.service;

import com.homeggu.pay.domain.charge.entity.Account;
import com.homeggu.pay.domain.charge.entity.HgMoney;
import com.homeggu.pay.domain.charge.repository.AccountRepository;
import com.homeggu.pay.domain.charge.repository.HgMoneyRepository;
import com.homeggu.pay.domain.payinfo.dto.response.HgMoneyInfoResponse;
import com.homeggu.pay.domain.payinfo.dto.response.HistoryResponse;
import com.homeggu.pay.domain.payinfo.repository.PayInfoCustomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class PayInfoServiceImpl implements PayInfoService {

    private final AccountRepository accountRepository;
    private final HgMoneyRepository hgMoneyRepository;
    private final PayInfoCustomRepository payInfoCustomRepository;

    @Override
    public HgMoneyInfoResponse getHgMoneyInfo(Long userId) {
        HgMoney hgMoney = hgMoneyRepository.findByUserId(userId).orElseThrow();
        Account account = accountRepository.findByUserId(userId).orElseThrow();

        return HgMoneyInfoResponse.builder()
                .hgMoneyBalance(hgMoney.getHgMoneyBalance())
                .accountNumber(account.getAccountNumber())
                .bank(account.getBank())
                .build();
    }

    @Override
    public Page<HistoryResponse> getHistory(Long userId, String filter, Pageable pageable) {
        return payInfoCustomRepository.getHistory(userId, filter, pageable);
    }

}
