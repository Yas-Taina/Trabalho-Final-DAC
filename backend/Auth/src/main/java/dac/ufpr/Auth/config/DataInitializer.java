package dac.ufpr.Auth.config;

import dac.ufpr.Auth.entity.Autenticacao;
import dac.ufpr.Auth.enums.EnRole;
import dac.ufpr.Auth.repository.AuthRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer {

    private static final String SENHA = "tads";

    @Bean
    CommandLineRunner initDatabase(AuthRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (repository.count() == 0) {
                List<Autenticacao> users = new ArrayList<>();

                Autenticacao cliente1 = new Autenticacao();
                cliente1.setEmail("cli1@bantads.com.br");
                cliente1.setSenha(passwordEncoder.encode(SENHA));
                cliente1.setRole(EnRole.CLIENTE);
                cliente1.setIdUsuario(1L);
                users.add(cliente1);

                Autenticacao cliente2 = new Autenticacao();
                cliente2.setEmail("cli2@bantads.com.br");
                cliente2.setSenha(passwordEncoder.encode(SENHA));
                cliente2.setRole(EnRole.CLIENTE);
                cliente2.setIdUsuario(2L);
                users.add(cliente2);

                Autenticacao cliente3 = new Autenticacao();
                cliente3.setEmail("cli3@bantads.com.br");
                cliente3.setSenha(passwordEncoder.encode(SENHA));
                cliente3.setRole(EnRole.CLIENTE);
                cliente3.setIdUsuario(3L);
                users.add(cliente3);

                Autenticacao cliente4 = new Autenticacao();
                cliente4.setEmail("cli4@bantads.com.br");
                cliente4.setSenha(passwordEncoder.encode(SENHA));
                cliente4.setRole(EnRole.CLIENTE);
                cliente4.setIdUsuario(4L);
                users.add(cliente4);

                Autenticacao cliente5 = new Autenticacao();
                cliente5.setEmail("cli5@bantads.com.br");
                cliente5.setSenha(passwordEncoder.encode(SENHA));
                cliente5.setRole(EnRole.CLIENTE);
                cliente5.setIdUsuario(5L);
                users.add(cliente5);

                Autenticacao gerente1 = new Autenticacao();
                gerente1.setEmail("ger1@bantads.com.br");
                gerente1.setSenha(passwordEncoder.encode(SENHA));
                gerente1.setRole(EnRole.GERENTE);
                gerente1.setIdUsuario(1L);
                users.add(gerente1);

                Autenticacao gerente2 = new Autenticacao();
                gerente2.setEmail("ger2@bantads.com.br");
                gerente2.setSenha(passwordEncoder.encode(SENHA));
                gerente2.setRole(EnRole.GERENTE);
                gerente2.setIdUsuario(2L);
                users.add(gerente2);

                Autenticacao gerente3 = new Autenticacao();
                gerente3.setEmail("ger3@bantads.com.br");
                gerente3.setSenha(passwordEncoder.encode(SENHA));
                gerente3.setRole(EnRole.GERENTE);
                gerente3.setIdUsuario(3L);
                users.add(gerente3);

                Autenticacao admin = new Autenticacao();
                admin.setEmail("adm1@bantads.com.br");
                admin.setSenha(passwordEncoder.encode(SENHA));
                admin.setRole(EnRole.ADMIN);
                admin.setIdUsuario(4L);
                users.add(admin);

                repository.saveAll(users);
            }
        };
    }

}
