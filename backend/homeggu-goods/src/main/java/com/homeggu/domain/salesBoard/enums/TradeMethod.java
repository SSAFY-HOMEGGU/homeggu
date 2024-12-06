package com.homeggu.domain.salesBoard.enums;

public enum TradeMethod {
    IN_PERSON("직거래"),
    SHIPPING("택배 거래"),;

    private final String displayName;

    TradeMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
