package com.homeggu.domain.like.dto.response;

import com.homeggu.domain.like.entity.Like;
import lombok.Builder;

@Builder
public class LikeResponse {
    private Like like;
    private boolean isLiked;
}
