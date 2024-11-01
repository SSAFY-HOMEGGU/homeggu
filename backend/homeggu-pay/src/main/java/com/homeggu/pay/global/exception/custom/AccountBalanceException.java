package com.homeggu.pay.global.exception.custom;

import com.homeggu.pay.global.exception.CustomException;
import org.springframework.http.HttpStatus;

public class AccountBalanceException extends CustomException {
    public AccountBalanceException() {
        super("계좌 잔액이 부족합니다.", HttpStatus.BAD_REQUEST);
    }
}
