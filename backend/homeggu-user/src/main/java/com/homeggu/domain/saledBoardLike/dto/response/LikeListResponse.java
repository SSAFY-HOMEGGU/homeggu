package com.homeggu.domain.saledBoardLike.dto.response;

import com.homeggu.domain.saledBoardLike.entity.SalesBoardLike;
import lombok.Builder;

import java.util.List;

@Builder
public class LikeListResponse {
    private List<SalesBoardLike> salesBoardLikeList;
}
