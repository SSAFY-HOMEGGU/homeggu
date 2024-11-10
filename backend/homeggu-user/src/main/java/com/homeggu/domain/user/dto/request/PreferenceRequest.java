package com.homeggu.domain.user.dto.request;

import lombok.Getter;

@Getter
public class PreferenceRequest {
    private String category;
    private String mood;
    private String action;
}
