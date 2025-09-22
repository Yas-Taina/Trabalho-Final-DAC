package dac.ufpr.conta.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import dac.ufpr.conta.dto.ContaDto;
import dac.ufpr.conta.entity.Conta;
import dac.ufpr.conta.entity.Movimentacao;
import dac.ufpr.conta.exception.BusinessException;
import dac.ufpr.conta.exception.ForbiddenException;
import dac.ufpr.conta.exception.NotFoundException;
import dac.ufpr.conta.mapper.ContaMapper;
import dac.ufpr.conta.messaging.EventPublisher;
import dac.ufpr.conta.repository.ContaRepository;
import dac.ufpr.conta.repository.MovimentoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import dac.ufpr.conta.enums.enTipoMovimento;


@Service
@RequiredArgsConstructor
public class ContaService {

    private static final Logger log = LoggerFactory.getLogger(ContaService.class);

    private final ContaRepository     contaRepo;
    private final MovimentoRepository movRepo;
    private final EventPublisher      publisher;

    public ContaDto criar(ContaDto contaDto) {
        log.info("Criando cliente: {}", contaDto);

        // validarCliente(contaDto, -1L);

        Conta conta = contaRepo.save(ContaMapper.toEntity(contaDto));
        log.info("Conta criada com sucesso: {}", conta);

        return ContaMapper.toDto(conta);
    }

    @Transactional
    public void depositar(String numeroConta, BigDecimal valor, Long usuarioIdDono) {
        Conta c = contaRepo.findByNumeroConta(numeroConta)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada"));
        validarDono(c, usuarioIdDono);

        BigDecimal v = valor.setScale(2, RoundingMode.HALF_UP);
        c.setSaldo(c.getSaldo().add(v));
        contaRepo.save(c);

        Movimentacao m = movRepo.save(novoMov(c, enTipoMovimento.DEPOSITO, numeroConta, null, v));
        publisher.publicarMovimentoRegistrado(m, '+');
        publisher.publicarSaldoAtualizado(c);
    }

    @Transactional
    public void sacar(String numeroConta, BigDecimal valor, Long usuarioIdDono) {
        Conta c = contaRepo.findByNumeroConta(numeroConta)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada"));
        validarDono(c, usuarioIdDono);

        BigDecimal v = valor.setScale(2, RoundingMode.HALF_UP);
        BigDecimal disponivel = c.getSaldo().add(c.getLimite());
        if (disponivel.compareTo(v) < 0) {
            throw new BusinessException("Saldo insuficiente");
        }

        c.setSaldo(c.getSaldo().subtract(v));
        contaRepo.save(c);

        Movimentacao m = movRepo.save(novoMov(c, enTipoMovimento.SAQUE, numeroConta, null, v));
        publisher.publicarMovimentoRegistrado(m, '-');
        publisher.publicarSaldoAtualizado(c);
    }

    @Transactional
    public void transferir(String origem, String destino, BigDecimal valor, Long usuarioIdDono) {
        if (origem.equals(destino)) throw new BusinessException("Mesma conta");

        Conta cOrig = contaRepo.findByNumeroConta(origem)
                .orElseThrow(() -> new NotFoundException("Conta origem não encontrada"));
        validarDono(cOrig, usuarioIdDono);

        Conta cDest = contaRepo.findByNumeroConta(destino)
                .orElseThrow(() -> new NotFoundException("Conta destino não encontrada"));

        BigDecimal v = valor.setScale(2, RoundingMode.HALF_UP);
        if (cOrig.getSaldo().add(cOrig.getLimite()).compareTo(v) < 0)
            throw new BusinessException("Saldo insuficiente");

        cOrig.setSaldo(cOrig.getSaldo().subtract(v));
        cDest.setSaldo(cDest.getSaldo().add(v));
        contaRepo.saveAll(List.of(cOrig, cDest));

        Movimentacao mOrig = movRepo.save(novoMov(cOrig, enTipoMovimento.TRANSFERENCIA, origem, destino, v));
        Movimentacao mDest = movRepo.save(novoMov(cDest, enTipoMovimento.TRANSFERENCIA, origem, destino, v));
        publisher.publicarMovimentoRegistrado(mOrig, '-');
        publisher.publicarMovimentoRegistrado(mDest, '+');
        publisher.publicarSaldoAtualizado(cOrig);
        publisher.publicarSaldoAtualizado(cDest);
    }

    private void validarDono(Conta c, Long usuarioId) {
        if (!c.getClienteId().equals(usuarioId))
            throw new ForbiddenException("Não é o dono da conta");
    }

    private Movimentacao novoMov(Conta c, enTipoMovimento tipo, String origem, String destino, BigDecimal v) {
        Movimentacao m = new Movimentacao();
        m.setConta(c);
        m.setDataHora(Instant.now());
        m.setTipo(tipo);
        m.setOrigemConta(origem);
        m.setDestinoConta(destino);
        m.setValor(v.setScale(2, RoundingMode.HALF_UP));
        return m;
    }
}
