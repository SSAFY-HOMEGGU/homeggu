package com.homeggu.pay.domain.transfer.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SafeTransfer {
    @Id
    private Long transferId;

    @MapsId // 부모 엔티티의 ID를 자식 엔티티의 ID로 매핑
    @OneToOne
    @JoinColumn(name = "transfer_id")
    private Transfer transfer;

    @Enumerated(EnumType.STRING)
    private StateCategory stateCategory = StateCategory.PENDING; // 안전송금 확정여부 상태 (초기값은 '미확정')

    private LocalDateTime confirmAt; // 확정일시

    public void confirm() {
        this.stateCategory = StateCategory.CONFIRMED;
        this.confirmAt = LocalDateTime.now();
    }

    public void cancel() {
        this.stateCategory = StateCategory.CANCELLED;
    }

    @Builder
    public SafeTransfer(Transfer transfer) {
        this.transfer = transfer;
    }
}
