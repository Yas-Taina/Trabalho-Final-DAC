package dac.ufpr.cliente.repository;

import dac.ufpr.cliente.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByCpfAndIdNot(String cpf, Long id);

    Optional<Cliente> findByCpf(String cpf);

    @Query("SELECT c FROM Cliente c WHERE c.cpf_gerente = :cpfGerente")
    List<Cliente> findByCpfGerente(@Param("cpfGerente") String cpfGerente);

    boolean existsByCpf(String cpf);

}
