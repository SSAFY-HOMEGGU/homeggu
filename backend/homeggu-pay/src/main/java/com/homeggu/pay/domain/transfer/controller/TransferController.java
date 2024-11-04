package com.homeggu.pay.domain.transfer.controller;

import com.homeggu.pay.domain.transfer.dto.request.TransferRequest;
import com.homeggu.pay.domain.transfer.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        System.out.println(transferRequest.isSafePay());

        if (!transferRequest.isSafePay()) {
            transferService.createNormalTransfer(senderId, transferRequest);
        } else {
            transferService.createSafeTransfer(senderId, transferRequest);
        }

        return ResponseEntity.status(CREATED).build();
    }
}
