package com.homeggu.domain.salesBoard.enums;

public enum IsSell {
    AVAILABLE("판매 중"),
    SOLD("판매 완료"),
    RESERVING("예약중"),;

    private final String displayName;

    IsSell(String displayName) {
        this.displayName = displayName;
    }
    public String getDisplayName() {
        return displayName;
    }

}
