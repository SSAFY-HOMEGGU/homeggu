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
public class HgMoney { // 홈꾸머니
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hgMoneyId;

    private Long userId; // MSA 설정 후, "User" 객체를 속성으로 가지도록 수정 필요

    private Long hgMoneyBalance;
    
    public void increaseBalance(Long chargeAmount) {
        this.hgMoneyBalance += chargeAmount; // 충전시 머니 잔액 증가
    }
}
