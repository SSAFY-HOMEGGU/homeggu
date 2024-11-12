package com.homeggu.domain.preference.dto.request;

import lombok.Getter;

@Getter
public class PreferenceRequest {
    private String category;
    private String mood;
    private String action;
}
