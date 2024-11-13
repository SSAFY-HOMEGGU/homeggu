package com.homeggu.domain.salesBoard.enums;

public enum Category {
    SOFA("소파"),
    BED("침대"),
    DINING_TABLE("식탁"),
    CHAIR("의자"),
    DRESSER("서랍장"),
    DESK("책상"),
    WARDROBE("장농"),
    TV_CABINET("TV 장식장"),
    BOOKSHELF("책장"),
    LIVING_FURNITURE("거실 가구"),
    KITCHEN_FURNITURE("주방 가구"),
    BATHROOM_FURNITURE("욕실 가구"),
    LIGHTING("조명기구"),
    DECOR_ITEM("데코 아이템");

    // 사용자한테 보일 이름
    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

}

