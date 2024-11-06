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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/pay-info")
@RequiredArgsConstructor
@Tag(name = "Pay Info", description = "페이 정보 API")
public class PayInfoController {

    private final PayInfoService payInfoService;

    @GetMapping
    @Operation(summary = "머니 정보 조회", description = "홈꾸머니 잔액 및 충전계좌의 은행과 계좌번호를 조회합니다.")
    public ResponseEntity<HgMoneyInfoResponse> getHgMoneyInfo(/*@AuthPrincipal @Parameter(hidden = true) Long userId,*/) {
        Long userId = 1L; // 테스트를 위해 임의로 설정 -> MSA 설정 이후 수정하기
        HgMoneyInfoResponse hgMoneyInfoResponse = payInfoService.getHgMoneyInfo(userId);
        return ResponseEntity.status(OK).body(hgMoneyInfoResponse);
    }

    @GetMapping("/history")
    @Operation(summary = "페이 이용내역 조회", description = "충전 및 송금 내역을 조회합니다.")
    public ResponseEntity<Page<HistoryResponse>> getHistory(/*@AuthPrincipal @Parameter(hidden = true) Long userId,*/
                                                                @RequestParam(required = false) String filter,
                                                                Pageable pageable) {
        Long userId = 1L; // 테스트를 위해 임의로 설정 -> MSA 설정 이후 수정하기
        Page<HistoryResponse> historyPage = payInfoService.getHistory(userId, filter, pageable);
        return ResponseEntity.status(OK).body(historyPage);
    }

}
