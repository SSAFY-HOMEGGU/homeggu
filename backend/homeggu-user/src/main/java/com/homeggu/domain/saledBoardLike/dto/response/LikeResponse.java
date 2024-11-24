package com.homeggu.domain.saledBoardLike.dto.response;

import com.homeggu.domain.saledBoardLike.entity.SalesBoardLike;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class LikeResponse {
    private Long salesBoardId;
    private boolean isLiked;
}
