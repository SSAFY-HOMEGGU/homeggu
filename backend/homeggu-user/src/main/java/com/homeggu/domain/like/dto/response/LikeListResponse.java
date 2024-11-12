package com.homeggu.domain.like.dto.response;

import com.homeggu.domain.like.entity.Like;
import lombok.Builder;

import java.util.List;

@Builder
public class LikeListResponse {
    private List<Like> likeList;
}
