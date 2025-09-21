package dac.ufpr.conta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dac.ufpr.conta.entity.Movimentacao;

@Repository
public interface MovimentoRepository extends JpaRepository<Movimentacao, Long> {
    List<Movimentacao> findByContaIdOrderByDataHoraAsc(Long contaId);
}
