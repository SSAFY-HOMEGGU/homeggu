package com.homeggu.pay.domain.payinfo.controller;

import com.homeggu.pay.domain.payinfo.dto.response.HgMoneyInfoResponse;
import com.homeggu.pay.domain.payinfo.dto.response.HistoryResponse;
import com.homeggu.pay.domain.payinfo.service.PayInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/pay/info")
@RequiredArgsConstructor
@Tag(name = "Pay Info", description = "페이 정보 API")
public class PayInfoController {

    private final PayInfoService payInfoService;

    @GetMapping
    @Operation(summary = "머니 정보 조회", description = "홈꾸머니 잔액 및 충전계좌의 은행과 계좌번호를 조회합니다.")
    public ResponseEntity<HgMoneyInfoResponse> getHgMoneyInfo(@RequestHeader(value = "userId", required = true) Long userId) {
        HgMoneyInfoResponse hgMoneyInfoResponse = payInfoService.getHgMoneyInfo(userId);
        return ResponseEntity.status(OK).body(hgMoneyInfoResponse);
    }

    @GetMapping("/history")
    @Operation(summary = "페이 이용내역 조회", description = "충전 및 송금 내역을 조회합니다.")
    public ResponseEntity<Page<HistoryResponse>> getHistory(@RequestHeader(value = "userId", required = true) Long userId,
                                                            @RequestParam(required = false) String filter,
                                                            Pageable pageable) {
        Page<HistoryResponse> historyPage = payInfoService.getHistory(userId, filter, pageable);
        return ResponseEntity.status(OK).body(historyPage);
    }

}
