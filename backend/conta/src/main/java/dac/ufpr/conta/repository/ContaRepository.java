package dac.ufpr.conta.repository;

import dac.ufpr.conta.entity.Conta;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {
    
    Optional<Conta> findByNumeroConta(String numeroConta);

    Optional<Conta> findByClienteId(Long clienteId);

    @Query(
            value = "SELECT cpfGerente " +
                    "FROM conta.conta " +
                    "GROUP BY cpfGerente " +
                    "ORDER BY COUNT(cpfGerente) ASC " +
                    "LIMIT 1",
            nativeQuery = true
    )
    String findGerenteCpfWithLeastAccounts();

    @Query(
            value = "SELECT COUNT(*) FROM conta.conta",
            nativeQuery = true
    )
    Long countAllContas();

    @Query(
            value = "SELECT COUNT(DISTINCT cpfGerente) FROM conta.conta",
            nativeQuery = true
    )
    Long countDistinctGerentes();

    @Query(
            value = "SELECT cpfGerente, COUNT(*) as conta_count " +
                    "FROM conta.conta " +
                    "GROUP BY cpfGerente " +
                    "ORDER BY conta_count DESC " +
                    "LIMIT 1",
            nativeQuery = true
    )
    Object[] findGerenteWithMostAccounts();

    @Query(
            value = "SELECT * FROM conta.conta " +
                    "WHERE cpfGerente = :cpfGerente " +
                    "AND saldo > 0 " +
                    "ORDER BY saldo ASC " +
                    "LIMIT 1",
            nativeQuery = true
    )
    Optional<Conta> findContaWithLowestPositiveBalance(String cpfGerente);

    @Query(
            value = "SELECT * FROM conta.conta " +
                    "WHERE cpfGerente = :cpfGerente " +
                    "LIMIT 1",
            nativeQuery = true
    )
    Optional<Conta> findAnyContaByGerente(String cpfGerente);

    @Query(
            value = "SELECT COUNT(*) FROM conta.conta WHERE cpfGerente = :cpfGerente",
            nativeQuery = true
    )
    Long countByGerenteCpf(String cpfGerente);

    @Query(
            value = "SELECT cpfGerente, COUNT(*) as conta_count " +
                    "FROM conta.conta " +
                    "GROUP BY cpfGerente " +
                    "HAVING COUNT(*) = (" +
                    "  SELECT MAX(conta_count) FROM (" +
                    "    SELECT COUNT(*) as conta_count " +
                    "    FROM conta.conta " +
                    "    GROUP BY cpfGerente" +
                    "  ) sub" +
                    ")",
            nativeQuery = true
    )
    java.util.List<Object[]> findAllGerentesWithMostAccounts();

}
