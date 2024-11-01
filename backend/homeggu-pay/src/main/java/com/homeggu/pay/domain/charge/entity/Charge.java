package com.homeggu.pay.domain.charge.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Charge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chargeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    private Long chargeAmount;

    private Long balanceAfterCharge; // 충전 후 홈꾸머니 잔액

    private LocalDateTime createAt; // 충전일시

    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
    }

    @Builder
    public Charge(Account account, Long chargeAmount, Long balanceAfterCharge) {
        this.account = account;
        this.chargeAmount = chargeAmount;
        this.balanceAfterCharge = balanceAfterCharge;
    }
}
