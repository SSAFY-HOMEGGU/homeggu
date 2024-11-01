package com.homeggu.pay.domain.charge.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    private Long userId; // MSA 설정 후, "User" 객체를 속성으로 가지도록 수정 필요

    private String accountNumber;

    private String bank;

    private Long accountBalance;
    
    public void decreaseBalance(Long chargeAmount) {
        this.accountBalance -= chargeAmount; // 충전시 계좌 잔액 감소
    }
}
