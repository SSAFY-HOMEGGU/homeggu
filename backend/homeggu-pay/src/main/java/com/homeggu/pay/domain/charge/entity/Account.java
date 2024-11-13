package com.homeggu.pay.domain.charge.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    private Long userId;

    private String accountNumber;

    private String bank;

    private Long accountBalance;
    
    public void decreaseBalance(Long chargeAmount) {
        this.accountBalance -= chargeAmount; // 충전시 계좌 잔액 감소
    }
}
