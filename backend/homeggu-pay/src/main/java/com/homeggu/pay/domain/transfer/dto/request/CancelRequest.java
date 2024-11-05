package com.homeggu.pay.domain.transfer.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CancelRequest {
    private Long transferId;
}
