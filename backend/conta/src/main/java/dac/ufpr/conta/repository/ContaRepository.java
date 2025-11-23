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
            value = "SELECT cpf_gerente " +
                    "FROM conta.conta " +
                    "GROUP BY cpf_gerente " +
                    "ORDER BY COUNT(cpf_gerente) ASC " +
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
            value = "SELECT COUNT(DISTINCT cpf_gerente) FROM conta.conta",
            nativeQuery = true
    )
    Long countDistinctGerentes();

    @Query(
            value = "SELECT cpf_gerente, COUNT(*) as conta_count " +
                    "FROM conta.conta " +
                    "GROUP BY cpf_gerente " +
                    "ORDER BY conta_count DESC " +
                    "LIMIT 1",
            nativeQuery = true
    )
    Object[] findGerenteWithMostAccounts();

    @Query(
            value = "SELECT * FROM conta.conta " +
                    "WHERE cpf_gerente = :cpfGerente " +
                    "AND saldo > 0 " +
                    "ORDER BY saldo ASC " +
                    "LIMIT 1",
            nativeQuery = true
    )
    Optional<Conta> findContaWithLowestPositiveBalance(String cpfGerente);

    @Query(
            value = "SELECT * FROM conta.conta " +
                    "WHERE cpf_gerente = :cpfGerente " +
                    "LIMIT 1",
            nativeQuery = true
    )
    Optional<Conta> findAnyContaByGerente(String cpfGerente);

    @Query(
            value = "SELECT COUNT(*) FROM conta.conta WHERE cpf_gerente = :cpfGerente",
            nativeQuery = true
    )
    Long countByGerenteCpf(String cpfGerente);

    @Query(
            value = "SELECT cpf_gerente, COUNT(*) as conta_count " +
                    "FROM conta.conta " +
                    "GROUP BY cpf_gerente " +
                    "HAVING COUNT(*) = (" +
                    "  SELECT MAX(conta_count) FROM (" +
                    "    SELECT COUNT(*) as conta_count " +
                    "    FROM conta.conta " +
                    "    GROUP BY cpf_gerente" +
                    "  ) sub" +
                    ")",
            nativeQuery = true
    )
    java.util.List<Object[]> findAllGerentesWithMostAccounts();

    @Query(
            value = "SELECT * FROM conta.conta WHERE cpf_gerente = :cpfGerente",
            nativeQuery = true
    )
    java.util.List<Conta> findAllByGerenteCpf(String cpfGerente);

}
