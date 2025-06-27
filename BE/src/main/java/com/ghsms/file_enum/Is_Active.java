package com.ghsms.file_enum;

public enum Is_Active {
    ACTIVE("ACTIVE"),
    INACTIVE("INACTIVE");

    private final String value;

    Is_Active(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
