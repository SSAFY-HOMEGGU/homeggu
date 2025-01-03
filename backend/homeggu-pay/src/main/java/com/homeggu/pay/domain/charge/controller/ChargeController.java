package com.homeggu.pay.domain.charge.controller;

import com.homeggu.pay.domain.charge.dto.request.ChargeRequest;
import com.homeggu.pay.domain.charge.service.ChargeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/pay/charge")
@RequiredArgsConstructor
@Tag(name = "Charge", description = "머니 충전 API")
public class ChargeController {

    private final ChargeService chargeService;

    @PostMapping
    @Operation(summary = "머니 충전", description = "계좌의 현금을 홈꾸머니로 변환합니다.")
    public ResponseEntity<?> createCharge(@RequestHeader(value = "userId", required = true) Long userId,
                                          @Valid @RequestBody ChargeRequest chargeRequest) {
        if (userId == null) {
            return ResponseEntity.status(BAD_REQUEST).body("Missing userId header");
        }
        chargeService.createCharge(userId, chargeRequest);
        return ResponseEntity.status(CREATED).build();
    }
}
