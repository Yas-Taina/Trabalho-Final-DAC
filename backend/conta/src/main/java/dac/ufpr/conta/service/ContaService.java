package dac.ufpr.conta.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;

import dac.ufpr.conta.dto.ContaDto;
import dac.ufpr.conta.dto.ExtratoDto;
import dac.ufpr.conta.dto.ExtratoMovimentacaoDto;
import dac.ufpr.conta.dto.SaldoDto;
import dac.ufpr.conta.dto.*;
import dac.ufpr.conta.mapper.ContaMapper;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.core.io.ClassPathResource;

import dac.ufpr.conta.entity.Conta;
import dac.ufpr.conta.entity.Movimentacao;
import dac.ufpr.conta.exception.BusinessException;
import dac.ufpr.conta.exception.ForbiddenException;
import dac.ufpr.conta.exception.NotFoundException;
import dac.ufpr.conta.messaging.EventPublisher;
import dac.ufpr.conta.repository.ContaRepository;
import dac.ufpr.conta.repository.MovimentoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import dac.ufpr.conta.enums.enTipoMovimento;

import java.nio.charset.StandardCharsets;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository contaRepo;
    private final MovimentoRepository movRepo;
    private final EventPublisher publisher;
    private final JdbcTemplate jdbcTemplate;

    public List<ContaDto> listar() {
        List<Conta> contas = contaRepo.findAll();
        return contas.stream()
                .map(ContaMapper::toDto)
                .toList();
    }

    public String recuperaCpfGerenteComMenosConta() {
        return contaRepo.findGerenteCpfWithLeastAccounts("");
    }

    @Transactional
    public SaldoDto depositar(String numeroConta, BigDecimal valor, Long usuarioIdDono) {
        Conta c = contaRepo.findByNumeroConta(numeroConta)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada"));
        validarDono(c, usuarioIdDono);

        BigDecimal v = valor.setScale(2, RoundingMode.HALF_UP);
        c.setSaldo(c.getSaldo().add(v));
        contaRepo.save(c);

        Movimentacao m = movRepo.save(novoMov(c, enTipoMovimento.DEPOSITO, numeroConta, null, v));
        publisher.publicarMovimentoRegistrado(m, '+');
        publisher.publicarSaldoAtualizado(c);

        return new SaldoDto(
                c.getClienteId().toString(),
                c.getNumeroConta(),
                c.getSaldo().setScale(2, RoundingMode.HALF_UP));
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
        if (origem.equals(destino))
            throw new BusinessException("Mesma conta");

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

    @Transactional
    public void transferirGenerica(String origem, String destino, BigDecimal valor) {

        if (origem.equals(destino))
            throw new BusinessException("Mesma conta");

        // verificar origem
        Conta cOrig = contaRepo.findByNumeroConta(origem)
                .orElseThrow(() -> new NotFoundException("Conta origem não encontrada"));

        BigDecimal v = valor.setScale(2, RoundingMode.HALF_UP);

        BigDecimal disponivel = cOrig.getSaldo().add(cOrig.getLimite());
        if (disponivel.compareTo(v) < 0)
            throw new BusinessException("Saldo insuficiente");

        // sempre debita origem
        cOrig.setSaldo(cOrig.getSaldo().subtract(v));
        contaRepo.save(cOrig);

        // registra movimento origem
        Movimentacao movOrig = movRepo.save(
                novoMov(cOrig, enTipoMovimento.TRANSFERENCIA, origem, destino, v));
        publisher.publicarMovimentoRegistrado(movOrig, '-');
        publisher.publicarSaldoAtualizado(cOrig);

        // tenta localizar destino
        Conta cDest = contaRepo.findByNumeroConta(destino).orElse(null);

        if (cDest != null) {
            // destino existe → creditar
            cDest.setSaldo(cDest.getSaldo().add(v));
            contaRepo.save(cDest);

            Movimentacao movDest = movRepo.save(
                    novoMov(cDest, enTipoMovimento.TRANSFERENCIA, origem, destino, v));
            publisher.publicarMovimentoRegistrado(movDest, '+');
            publisher.publicarSaldoAtualizado(cDest);
        }

        // se não existir → nada a fazer
    }

    public ContaDto getByClienteId(Long clienteId) {
        Conta c = contaRepo.findByClienteId(clienteId)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada para o cliente"));
        return ContaMapper.toDto(c);
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

    // em dac.ufpr.conta.service.ContaService (adicione este método)

    public SaldoDto consultarSaldo(String numeroConta) {
        Conta c = contaRepo.findByNumeroConta(numeroConta)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada"));

        // BigDecimal saldo = c.getSaldo() != null
        // ? c.getSaldo().setScale(2, RoundingMode.HALF_UP)
        // : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        // cliente é um Long no entity; converto para string (forma igual ao exemplo)
        // String cliente = c.getClienteId() == null ? null :
        // c.getClienteId().toString();

        return new SaldoDto(
                c.getClienteId().toString(),
                c.getNumeroConta(),
                c.getSaldo());
    }

    @Transactional
    public SaldoDto depositarAndGetSaldo(String numeroConta, BigDecimal valor) {
        // procura a conta (lança NotFoundException se não achar)
        Conta c = contaRepo.findByNumeroConta(numeroConta)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada"));

        // valida dono
        // validarDono(c, usuarioIdDono);

        // aplica valor com escala
        BigDecimal v = valor.setScale(2, RoundingMode.HALF_UP);

        // atualiza saldo
        if (c.getSaldo() == null) {
            c.setSaldo(v);
        } else {
            c.setSaldo(c.getSaldo().add(v));
        }
        contaRepo.save(c);

        // registra movimentacao e publica eventos
        Movimentacao m = movRepo.save(novoMov(c, enTipoMovimento.DEPOSITO, numeroConta, null, v));
        publisher.publicarMovimentoRegistrado(m, '+');
        publisher.publicarSaldoAtualizado(c);

        // retorna SaldoDto atualizado (converte clienteId para string como em
        // consultarSaldo)
        return new SaldoDto(
                c.getClienteId() == null ? null : c.getClienteId().toString(),
                c.getNumeroConta(),
                c.getSaldo().setScale(2, RoundingMode.HALF_UP));
    }

    @Transactional
    public SaldoDto sacarAndGetSaldo(String numeroConta, BigDecimal valor) {
        Conta c = contaRepo.findByNumeroConta(numeroConta)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada"));

        BigDecimal v = valor.setScale(2, RoundingMode.HALF_UP);

        BigDecimal saldoAtual = c.getSaldo() == null ? BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP) : c.getSaldo();
        BigDecimal limite = c.getLimite() == null ? BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP) : c.getLimite();
        BigDecimal disponivel = saldoAtual.add(limite);
        if (disponivel.compareTo(v) < 0) {
            throw new BusinessException("Saldo insuficiente");
        }

        c.setSaldo(saldoAtual.subtract(v));
        contaRepo.save(c);

        Movimentacao m = movRepo.save(novoMov(c, enTipoMovimento.SAQUE, numeroConta, null, v));
        publisher.publicarMovimentoRegistrado(m, '-');
        publisher.publicarSaldoAtualizado(c);

        return new SaldoDto(
                c.getClienteId() == null ? null : c.getClienteId().toString(),
                c.getNumeroConta(),
                c.getSaldo().setScale(2, RoundingMode.HALF_UP));
    }

    // @Transactional
    // public List<MovimentacaoDto> extrato(String numeroConta) {
    //     Conta c = contaRepo.findByNumeroConta(numeroConta)
    //             .orElseThrow(() -> new NotFoundException("Conta não encontrada"));

    //     List<Movimentacao> movs = movRepo.findByContaIdOrderByDataHoraAsc(c.getId());

    //     return movs.stream()
    //             .map(MovimentacaoMapper::toDto)
    //             .toList();
    // }

    @Transactional
    public ExtratoDto extrato(String numeroConta) {
        Conta conta = contaRepo.findByNumeroConta(numeroConta)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada"));

        List<Movimentacao> movs = movRepo.findByContaIdOrderByDataHoraAsc(conta.getId());

        List<ExtratoMovimentacaoDto> lista = movs.stream()
                .map(m -> new ExtratoMovimentacaoDto(
                        m.getDataHora(),
                        m.getTipo().name().toLowerCase(), // "saque", "deposito", "transferencia"
                        m.getOrigemConta(),
                        m.getDestinoConta(),
                        m.getValor()))
                .toList();

        return new ExtratoDto(
                conta.getNumeroConta(),
                conta.getSaldo(),
                lista);
    }

    @Transactional
    public void reboot() {
        try {
            // Lê o arquivo SQL do classpath
            ClassPathResource resource = new ClassPathResource("db/changelog/scripts/04_seed.sql");
            String sql = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            
            // Processa o SQL removendo comentários e dividindo em statements
            StringBuilder currentStatement = new StringBuilder();
            String[] lines = sql.split("\n");
            
            for (String line : lines) {
                // Remove comentários de linha
                int commentIndex = line.indexOf("--");
                String processedLine = commentIndex >= 0 ? line.substring(0, commentIndex) : line;
                processedLine = processedLine.trim();
                
                if (!processedLine.isEmpty()) {
                    currentStatement.append(" ").append(processedLine);
                    
                    // Se encontra ponto-e-vírgula, executa o statement
                    if (processedLine.endsWith(";")) {
                        String statement = currentStatement.toString().trim();
                        if (!statement.isEmpty() && !statement.equals(";")) {
                            // Remove o ponto-e-vírgula final
                            statement = statement.substring(0, statement.length() - 1).trim();
                            jdbcTemplate.execute(statement);
                        }
                        currentStatement = new StringBuilder();
                    }
                }
            }
        } catch (IOException e) {
            throw new BusinessException("Erro ao executar reboot: " + e.getMessage());
        }
    }

    public Conta findContaToReassign() {
        Long totalContas = contaRepo.countAllContas();
        Long totalGerentes = contaRepo.countDistinctGerentes();
        
        if (totalContas == 0 || totalGerentes == 0) {
            return null;
        }
        
        if (totalGerentes == 1 && totalContas == 1) {
            return null;
        }
        
        java.util.List<Object[]> gerentesComMaisContas = contaRepo.findAllGerentesWithMostAccounts();
        if (gerentesComMaisContas == null || gerentesComMaisContas.isEmpty()) {
            return null;
        }
        
        Long maxContaCount = ((Number) gerentesComMaisContas.get(0)[1]).longValue();
        
        if (maxContaCount <= 1) {
            return null;
        }
        
        if (gerentesComMaisContas.size() == 1) {
            String cpfGerente = (String) gerentesComMaisContas.get(0)[0];
            return contaRepo.findAnyContaByGerente(cpfGerente).orElse(null);
        }
        
        Conta contaEscolhida = null;
        BigDecimal menorSaldo = null;
        
        for (Object[] row : gerentesComMaisContas) {
            String cpfGerente = (String) row[0];
            Optional<Conta> contaComMenorSaldo = contaRepo.findContaWithLowestPositiveBalance(cpfGerente);
            
            if (contaComMenorSaldo.isPresent()) {
                BigDecimal saldo = contaComMenorSaldo.get().getSaldo();
                if (menorSaldo == null || saldo.compareTo(menorSaldo) < 0) {
                    menorSaldo = saldo;
                    contaEscolhida = contaComMenorSaldo.get();
                }
            }
        }
        
        if (contaEscolhida != null) {
            return contaEscolhida;
        }
        
        String cpfPrimeiroGerente = (String) gerentesComMaisContas.get(0)[0];
        return contaRepo.findAnyContaByGerente(cpfPrimeiroGerente).orElse(null);
    }

    @Transactional
    public void reassignConta(Long contaId, String novoGerenteCpf) {
        Conta conta = contaRepo.findById(contaId)
                .orElseThrow(() -> new NotFoundException("Conta não encontrada"));
        
        conta.setCpfGerente(novoGerenteCpf);
        contaRepo.save(conta);
    }

    public ContaDto criar(ClienteDto clienteDto) {
        Conta contaExistente = contaRepo.findByClienteId(clienteDto.getId()).orElse(null);

        if (Objects.nonNull(contaExistente)) {
            return ContaMapper.toDto(contaExistente);
        }

        Conta conta = new Conta();
        conta.setClienteId(clienteDto.getId());
        conta.setNumeroConta(gerarNumeroConta());
        conta.setSaldo(BigDecimal.ZERO);
        conta.setLimite(calcularLimite(clienteDto.getSalario()));
        conta.setCpfGerente(clienteDto.getCpf_gerente());
        Conta contaSalva = contaRepo.save(conta);
        return ContaMapper.toDto(contaSalva);
    }

    public void deletar(ClienteDto clienteDto) {
        Conta conta = contaRepo.findByClienteId(clienteDto.getId())
                .orElseThrow(() -> new NotFoundException("Conta não encontrada para o cliente"));
        contaRepo.delete(conta);
    }

    private String gerarNumeroConta() {
        int numero = (int)(Math.random() * 9000) + 1000;
        return String.valueOf(numero);
    }

    public BigDecimal calcularLimite(BigDecimal salarioMensal) {
        BigDecimal salarioMinimoParaLimite = new BigDecimal("2000.00");

        if (salarioMensal.compareTo(salarioMinimoParaLimite) >= 0) {
            return salarioMensal.multiply(new BigDecimal("0.5"));
        }

        return BigDecimal.ZERO;
    }
    public java.util.List<Conta> findAllContasByGerente(String cpfGerente) {
        return contaRepo.findAllByGerenteCpf(cpfGerente);
    }

    @Transactional
    public Map<String, Object> reassignAllContasOnDelete(String deletedGerenteCpf) {
        java.util.List<Conta> contasToReassign = findAllContasByGerente(deletedGerenteCpf);
        
        if (contasToReassign.isEmpty()) {
            return Map.of("contaIds", List.of(), "clienteIds", List.of(), "newGerenteCpf", "");
        }

        String newGerenteCpf = contaRepo.findGerenteCpfWithLeastAccounts(deletedGerenteCpf);
        
        if (newGerenteCpf == null) {
            throw new RuntimeException("Nenhum gerente disponível para reassociação");
        }

        java.util.List<Long> reassignedContaIds = new java.util.ArrayList<>();
        java.util.List<Long> reassignedClienteIds = new java.util.ArrayList<>();

        for (Conta conta : contasToReassign) {
            conta.setCpfGerente(newGerenteCpf);
            contaRepo.save(conta);
            
            reassignedContaIds.add(conta.getId());
            if (conta.getClienteId() != null) {
                reassignedClienteIds.add(conta.getClienteId());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("contaIds", reassignedContaIds);
        result.put("clienteIds", reassignedClienteIds);
        result.put("newGerenteCpf", newGerenteCpf);
        
        return result;
    }

}
