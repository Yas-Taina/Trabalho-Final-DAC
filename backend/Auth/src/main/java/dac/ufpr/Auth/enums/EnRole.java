package dac.ufpr.Auth.enums;

import java.util.Arrays;

public enum EnRole {

    CLIENTE,
    GERENTE,
    ADMIN;

    public static EnRole findByName(String name) {
        return Arrays.stream(EnRole.values())
                .filter(role -> role.name().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }
}
