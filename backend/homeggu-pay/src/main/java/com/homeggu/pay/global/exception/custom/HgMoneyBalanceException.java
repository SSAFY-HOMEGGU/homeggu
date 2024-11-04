package com.homeggu.pay.global.exception.custom;

import com.homeggu.pay.global.exception.CustomException;
import org.springframework.http.HttpStatus;

public class HgMoneyBalanceException extends CustomException {
    public HgMoneyBalanceException() {
        super("홈꾸머니 잔액이 부족합니다. 충전 후 다시 송금을 시도해주세요.", HttpStatus.BAD_REQUEST);
    }
}
