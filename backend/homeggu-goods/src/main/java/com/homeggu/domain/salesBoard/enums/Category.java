package com.homeggu.domain.salesBoard.enums;

public enum Category {
    APPLIANCES("가전"),
    BED("침대"),
    DESK("책상"),
    DINING_TABLE("식탁"),
    CHAIR("의자"),
    SOFA("소파"),
    LIGHTING("조명"),
    LAMP("전등"),
    STORAGE("수납"),
    DRAWER("서랍");

    // 사용자한테 보일 이름
    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

}

