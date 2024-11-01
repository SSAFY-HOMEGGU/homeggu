package com.homeggu.pay.domain.charge.service;

import com.homeggu.pay.domain.charge.dto.request.ChargeRequest;
import com.homeggu.pay.domain.charge.entity.Account;
import com.homeggu.pay.domain.charge.entity.Charge;
import com.homeggu.pay.domain.charge.entity.HgMoney;
import com.homeggu.pay.domain.charge.repository.AccountRepository;
import com.homeggu.pay.domain.charge.repository.ChargeRepository;
import com.homeggu.pay.domain.charge.repository.HgMoneyRepository;
import com.homeggu.pay.global.exception.custom.AccountBalanceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class ChargeServiceImpl implements ChargeService {

    private final ChargeRepository chargeRepository;
    private final AccountRepository accountRepository;
    private final HgMoneyRepository hgMoneyRepository;

    @Override
    public void createCharge(Long userId, ChargeRequest chargeRequest) {
        Account account = accountRepository.findByUserId(userId).orElseThrow();
        HgMoney hgMoney = hgMoneyRepository.findByUserId(userId).orElseThrow();

        // 계좌 잔액 부족시 예외 처리
        Long chargeAmount = chargeRequest.getChargeAmount();
        if (account.getAccountBalance() < chargeAmount) {
            throw new AccountBalanceException();
        }

        account.decreaseBalance(chargeAmount); // 계좌 잔액 감소
        hgMoney.increaseBalance(chargeAmount); // 홈꾸머니 잔액 증가

        // 충전 내역 생성
        Charge charge = Charge.builder()
                .account(account)
                .chargeAmount(chargeRequest.getChargeAmount())
                .balanceAfterCharge(hgMoney.getHgMoneyBalance())
                .build();

        chargeRepository.save(charge);
    }

}
