package com.ghsms.util;

import java.util.HashMap;
import java.util.Map;

public class RoleNameConverter {
    private static final Map<String, String> vnToEng = new HashMap<>();
    private static final Map<String, String> engToVn = new HashMap<>();

    static {
        engToVn.put("ROLE_ADMIN", "Quản trị viên");
        engToVn.put("ROLE_MANAGER", "Quản lý");
        engToVn.put("ROLE_STAFF", "Nhân viên");
        engToVn.put("ROLE_CONSULTANT", "Tư vấn viên");
        engToVn.put("ROLE_CUSTOMER", "Khách hàng");

        // Reverse mapping
        engToVn.forEach((eng, vn) -> vnToEng.put(vn, eng));
    }

    public static String toVietnamese(String englishName) {
        return engToVn.getOrDefault(englishName.toUpperCase(), englishName);
    }

    public static String toEnglish(String vietnameseName) {
        return vnToEng.getOrDefault(vietnameseName, vietnameseName);
    }
}