package dac.ufpr.conta.mapper;

import dac.ufpr.conta.dto.ContaDto;
import dac.ufpr.conta.entity.Conta;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeParseException;

public class ContaMapper {

    private static Instant parseInstant(String value) {
        if (value == null) return null;
        try {
            return Instant.parse(value);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Data inválida no DTO: " + value, e);
        }
    }

    public static Conta toEntity(ContaDto dto) {
        if (dto == null) return null;

        return new Conta(
                dto.id(),
                dto.numeroConta(),
                dto.clienteId(),
                dto.gerenteId(),
                parseInstant(dto.dataCriacao()),
                parseInstant(dto.dataAtualizacao()),
                dto.saldo() != null ? new BigDecimal(dto.saldo()) : BigDecimal.ZERO,
                dto.limite() != null ? new BigDecimal(dto.limite()) : BigDecimal.ZERO,
                dto.versao()
        );
    }

    public static ContaDto toDto(Conta entity) {
        if (entity == null) return null;

        return new ContaDto(
                entity.getId(),
                entity.getNumeroConta(),
                entity.getClienteId(),
                entity.getGerenteId(),
                entity.getDataCriacao() != null ? entity.getDataCriacao().toString() : null,
                entity.getDataAtualizacao() != null ? entity.getDataAtualizacao().toString() : null,
                entity.getSaldo() != null ? entity.getSaldo().toPlainString() : null,
                entity.getLimite() != null ? entity.getLimite().toPlainString() : null,
                entity.getVersao()
        );
    }

    public static void updateEntityFromDto(ContaDto dto, Conta entity) {
        if (dto == null || entity == null) return;

        entity.setNumeroConta(dto.numeroConta());
        entity.setClienteId(dto.clienteId());
        entity.setGerenteId(dto.gerenteId());
        if (dto.saldo() != null) {
            entity.setSaldo(new BigDecimal(dto.saldo()));
        }
        if (dto.limite() != null) {
            entity.setLimite(new BigDecimal(dto.limite()));
        }
    }
}
