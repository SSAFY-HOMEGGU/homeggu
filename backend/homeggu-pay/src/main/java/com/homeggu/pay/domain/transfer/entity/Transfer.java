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
public class Transfer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transferId;

    private Long salesBoardId;
//    @OneToOne
//    @JoinColumn(name = "sales_Board_id")
//    private SalesBoard salesBoard;

    private Long senderId;
//    @ManyToOne
//    @JoinColumn(name = "send_User_id")
//    private User sendUser;

    private Long receiverId;
//    @ManyToOne
//    @JoinColumn(name = "receive_User_id")
//    private User receiveUser;

    private Long transferAmount;

    private Long senderBalance; // 송금 후 송금자 머니 잔액

    private Long receiverBalance; // 송금 후 수취자 머니 잔액

    private LocalDateTime createAt; // 송금일시

    @Enumerated(EnumType.STRING)
    private StateCategory stateCategory; // 안전송금 확정여부 상태

    private LocalDateTime confirmAt; // 확정일시

    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
    }

    public void confirm(Long receiverBalance) {
        this.receiverBalance = receiverBalance;
        this.stateCategory = StateCategory.CONFIRMED;
        this.confirmAt = LocalDateTime.now();
    }

    public void cancel() {
        this.stateCategory = StateCategory.CANCELLED;
    }

    @Builder
    public Transfer(Long salesBoardId, Long senderId, Long receiverId, Long transferAmount, Long senderBalance, Long receiverBalance, StateCategory stateCategory) {
        this.salesBoardId = salesBoardId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.transferAmount = transferAmount;
        this.senderBalance = senderBalance;
        this.receiverBalance = receiverBalance;
        this.stateCategory = stateCategory;
    }
}
