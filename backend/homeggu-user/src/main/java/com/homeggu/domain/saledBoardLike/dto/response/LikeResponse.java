package com.homeggu.domain.saledBoardLike.dto.response;

import com.homeggu.domain.saledBoardLike.entity.SalesBoardLike;
import lombok.Builder;

@Builder
public class LikeResponse {
    private SalesBoardLike salesBoardLike;
    private boolean isLiked;
}
