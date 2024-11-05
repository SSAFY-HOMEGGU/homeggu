package com.homeggu.pay.domain.transfer.controller;

import com.homeggu.pay.domain.transfer.dto.request.CancelRequest;
import com.homeggu.pay.domain.transfer.dto.request.ConfirmRequest;
import com.homeggu.pay.domain.transfer.dto.request.TransferRequest;
import com.homeggu.pay.domain.transfer.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/transfer")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @PostMapping
    @Operation(summary = "머니 송금", description = "충전된 홈꾸머니를 다른 사람에게 송금합니다.")
    public ResponseEntity<Void> createTransfer(/*@AuthPrincipal @Parameter(hidden = true) Long senderId,*/
                                                @RequestBody TransferRequest transferRequest) {
        Long senderId = 1L; // 테스트를 위해 임의로 설정 -> MSA 설정 이후 수정하기

        if (!transferRequest.isSafePay()) {
            transferService.createNormalTransfer(senderId, transferRequest);
        } else {
            transferService.createSafeTransfer(senderId, transferRequest);
        }

        return ResponseEntity.status(CREATED).build();
    }

    @PatchMapping("/confirm")
    @Operation(summary = "안전송금 확정", description = "안전송금 상태를 '미확정'에서 '확정'으로 변경합니다.")
    public ResponseEntity<Void> confirmSafePay(@RequestBody ConfirmRequest confirmRequest) {
        transferService.confirmSafePay(confirmRequest);
        return ResponseEntity.status(NO_CONTENT).build();
    }

    @PatchMapping("/cancel")
    @Operation(summary = "안전송금 취소", description = "안전송금 상태를 '미확정'에서 '취소'로 변경합니다.")
    public ResponseEntity<Void> cancelSafePay(@RequestBody CancelRequest cancelRequest) {
        transferService.cancelSafePay(cancelRequest);
        return ResponseEntity.status(NO_CONTENT).build();
    }

}
