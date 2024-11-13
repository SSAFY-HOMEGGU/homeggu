package com.homeggu.pay.domain.charge.controller;

import com.homeggu.pay.domain.charge.dto.request.ChargeRequest;
import com.homeggu.pay.domain.charge.service.ChargeService;
import com.homeggu.pay.global.auth.AuthPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/pay/charge")
@RequiredArgsConstructor
@Tag(name = "Charge", description = "머니 충전 API")
public class ChargeController {

    private final ChargeService chargeService;

    @PostMapping
    @Operation(summary = "머니 충전", description = "계좌의 현금을 홈꾸머니로 변환합니다.")
    public ResponseEntity<Void> createCharge(@RequestHeader("userId") Long userId, @RequestBody ChargeRequest chargeRequest) {
        if (userId == null) {
            throw new IllegalArgumentException("userId header is missing");
        }
        chargeService.createCharge(userId, chargeRequest);
        return ResponseEntity.status(CREATED).build();
    }
}
