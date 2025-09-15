package dac.ufpr.Auth.security.enconde;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public class Sha256SaltPasswordEncoder implements PasswordEncoder {
    private static final int SALT_LENGTH = 16;

    @Override
    public String encode(CharSequence rawPassword) {
        byte[] salt = generateSalt();
        String saltBase64 = Base64.getEncoder().encodeToString(salt);
        String hash = hashWithSalt(rawPassword.toString(), salt);
        return saltBase64 + ":" + hash;
    }

    @Override
    public boolean matches(CharSequence rawPassword, String storedPassword) {
        String[] parts = storedPassword.split(":");
        if (parts.length != 2) return false;

        byte[] salt = Base64.getDecoder().decode(parts[0]);
        String hashToCompare = hashWithSalt(rawPassword.toString(), salt);
        return hashToCompare.equals(parts[1]);
    }

    private String hashWithSalt(String password, byte[] salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashed = md.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashed);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash SHA-256", e);
        }
    }

    private byte[] generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[SALT_LENGTH];
        random.nextBytes(salt);
        return salt;
    }

}
