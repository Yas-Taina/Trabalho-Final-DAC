package dac.ufpr.conta.repository;

import dac.ufpr.conta.entity.Conta;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {
    
    Optional<Conta> findByNumeroConta(String numeroConta);



}
