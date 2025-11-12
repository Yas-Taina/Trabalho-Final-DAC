package dac.ufpr.Auth.security.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtExtractor {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public Optional<String> getAuthenticatedUser() {
        return getAllClaims().map(Claims::getSubject);
    }

    public Optional<String> getAuthenticatedRole() {
        return getAllClaims()
                .map(claims -> claims.get("role", String.class));
    }

    public Optional<String> getAuthenticatedCpf() {
        return getAllClaims()
                .map(claims -> claims.get("cpf", String.class));
    }

    public <T> Optional<T> getClaimValue(String claimName, Class<T> type) {
        return getAllClaims()
                .map(claims -> claims.get(claimName, type));
    }

    public Optional<Claims> getAllClaims() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getCredentials() instanceof String)) {
                return Optional.empty();
            }
            String token = (String) authentication.getCredentials();
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return Optional.of(claims);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
