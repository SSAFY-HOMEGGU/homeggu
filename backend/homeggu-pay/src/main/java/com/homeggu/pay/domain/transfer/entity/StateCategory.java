package com.homeggu.pay.domain.transfer.entity;

public enum StateCategory { // 안전송금 상태
    PENDING, // 미확정
    CONFIRMED, // 확정
    CANCELLED // 취소
}
