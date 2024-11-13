package com.homeggu.domain.salesBoard.enums;

public enum Status {

    UNUSED("미사용"),
    LIKENEW("사용감 적음"),
    USED("사용감 있음"),
    BROKEN("하자 있음"),
    UNPACKED("미개봉");

    private final String displayName;

    Status(String displayName) {
        this.displayName = displayName;
    }
    public String getDisplayName() {
        return displayName;
    }


}
