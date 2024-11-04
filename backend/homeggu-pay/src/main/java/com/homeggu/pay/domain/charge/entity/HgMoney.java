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

    private Long userId;
//    @OneToOne
//    @JoinColumn(name = "user_id")
//    private User user;

    private Long hgMoneyBalance;
    
    public void increaseBalance(Long chargeAmount) {
        this.hgMoneyBalance += chargeAmount;
    }

    public void decreaseBalance(Long chargeAmount) {
        this.hgMoneyBalance -= chargeAmount;
    }
}
