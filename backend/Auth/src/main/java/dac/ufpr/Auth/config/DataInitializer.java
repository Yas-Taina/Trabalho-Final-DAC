package dac.ufpr.Auth.config;

import dac.ufpr.Auth.entity.Autenticacao;
import dac.ufpr.Auth.enums.EnRole;
import dac.ufpr.Auth.repository.AuthRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private static final String SENHA = "tads";

    @Bean
    CommandLineRunner initDatabase(AuthRepository repository, PasswordEncoder encoder) {
        return args -> {
            // CLIENTES (CPFs exigidos pelo testador)
            upsert(repository, encoder, "cli1@bantads.com.br", "12912861012", EnRole.CLIENTE);
            upsert(repository, encoder, "cli2@bantads.com.br", "09506382000", EnRole.CLIENTE);
            upsert(repository, encoder, "cli3@bantads.com.br", "85733854057", EnRole.CLIENTE);
            upsert(repository, encoder, "cli4@bantads.com.br", "58872160006", EnRole.CLIENTE);
            upsert(repository, encoder, "cli5@bantads.com.br", "76179646090", EnRole.CLIENTE);

            // GERENTES
            upsert(repository, encoder, "ger1@bantads.com.br", "98574307084", EnRole.GERENTE);
            upsert(repository, encoder, "ger2@bantads.com.br", "64065268052", EnRole.GERENTE);
            upsert(repository, encoder, "ger3@bantads.com.br", "23862179060", EnRole.GERENTE);

            // ADMIN
            upsert(repository, encoder, "adm1@bantads.com.br", "40501740066", EnRole.ADMINISTRADOR);
        };
    }

    private void upsert(AuthRepository repository, PasswordEncoder encoder,
                        String email, String cpf, EnRole role) {

        repository.findByEmail(email).ifPresentOrElse(u -> {
            boolean changed = false;

            if (u.getCpf() == null || !u.getCpf().equals(cpf)) {
                u.setCpf(cpf);
                changed = true;
            }
            if (u.getRole() != role) {
                u.setRole(role);
                changed = true;
            }
            // opcional: padronizar senha apenas se desejar forçar "tads" nos seeds
            // u.setSenha(encoder.encode(SENHA)); changed = true;

            if (changed) repository.save(u);
        }, () -> {
            Autenticacao novo = new Autenticacao();
            novo.setEmail(email);
            novo.setSenha(encoder.encode(SENHA));
            novo.setRole(role);
            novo.setCpf(cpf);
            repository.save(novo);
        });
    }
}
