package dac.ufpr.Auth.repository;

import dac.ufpr.Auth.entity.Autenticacao;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends MongoRepository<Autenticacao, String> {

    Optional<Autenticacao> findByEmail(String email);

}
