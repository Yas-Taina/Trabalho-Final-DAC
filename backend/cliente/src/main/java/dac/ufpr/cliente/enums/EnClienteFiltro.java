package dac.ufpr.cliente.enums;

import java.util.Arrays;

public enum EnClienteFiltro {

    PARA_APROVAR,
    ADM_RELATORIO_CLIENTES,
    MELHORES_CLIENTES;

    public static EnClienteFiltro findBy(String filtro) {
        return Arrays.stream(EnClienteFiltro.values())
                .filter(f -> f.name().equalsIgnoreCase(filtro))
                .findFirst()
                .orElse(null);
    }
}
