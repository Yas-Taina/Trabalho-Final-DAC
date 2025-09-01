package dac.ufpr.gerente.repository;

import dac.ufpr.gerente.model.Gerente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GerenteRepository extends JpaRepository<Gerente, Long> {
    boolean existsByCpf(String cpf);

}
