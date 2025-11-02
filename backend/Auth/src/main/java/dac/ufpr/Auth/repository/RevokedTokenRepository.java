package dac.ufpr.Auth.repository;

import dac.ufpr.Auth.entity.Autenticacao;
import dac.ufpr.Auth.entity.TokenRevogado;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevokedTokenRepository extends MongoRepository<TokenRevogado, String> {

    boolean existsByToken(String token);

}
