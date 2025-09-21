package dac.ufpr.conta.messaging;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import dac.ufpr.conta.entity.Conta;
import dac.ufpr.conta.entity.Movimentacao;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public static final String EXCHANGE = "bantads.conta.events";

    public void publicarMovimentoRegistrado(Movimentacao m, char sinal) {
        var evt = new MovimentoRegistradoEvent(
                m.getId(),
                m.getConta().getNumeroConta(),
                m.getDataHora(),
                m.getTipo().name(),
                m.getOrigemConta(),
                m.getDestinoConta(),
                m.getValor(),
                sinal
        );
        rabbitTemplate.convertAndSend(EXCHANGE, "conta.movimento.registrado", evt);
    }

    public void publicarSaldoAtualizado(Conta c) {
        var evt = new SaldoAtualizadoEvent(
                c.getNumeroConta(),
                c.getSaldo(),
                c.getLimite()
        );
        rabbitTemplate.convertAndSend(EXCHANGE, "conta.saldo.atualizado", evt);
    }

    public record MovimentoRegistradoEvent(
            Long idMovimento,
            String numeroConta,
            Instant dataHora,
            String tipo,
            String origemConta,
            String destinoConta,
            BigDecimal valor,
            char sinal
    ) {}

    public record SaldoAtualizadoEvent(
            String numeroConta,
            BigDecimal saldo,
            BigDecimal limite
    ) {}
}
