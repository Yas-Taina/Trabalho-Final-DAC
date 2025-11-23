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


}
