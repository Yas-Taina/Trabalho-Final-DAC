package dac.ufpr.gerente.repository;

import dac.ufpr.gerente.entity.Gerente;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GerenteRepository extends JpaRepository<Gerente, String> {
    Optional<Gerente> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
    
    @Transactional
    void deleteByCpf(String cpf);
}
