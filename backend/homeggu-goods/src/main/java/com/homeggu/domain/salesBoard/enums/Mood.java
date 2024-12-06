package com.homeggu.domain.salesBoard.enums;

public enum Mood {
    WOOD_VINTAGE("우드&빈티지"),
    BLACK_METALLIC("블랙&메탈릭"),
    WHITE_MINIMAL("화이트&미니멀"),
    MODERN_CLASSIC("모던&클래식");

    private final String displayName;

    Mood(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
