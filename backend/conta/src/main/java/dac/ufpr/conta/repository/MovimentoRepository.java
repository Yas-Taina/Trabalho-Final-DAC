package dac.ufpr.conta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dac.ufpr.conta.entity.Monivemntacao;

@Repository
public interface MovimentoRepository extends JpaRepository<Monivemntacao, Long> {
    // métodos extras se precisar, ex:
    // List<Movimento> findByContaIdOrderByDataHoraAsc(Long contaId);
}
