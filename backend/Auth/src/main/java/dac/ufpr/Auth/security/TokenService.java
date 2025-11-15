package dac.ufpr.Auth.security;

import dac.ufpr.Auth.entity.TokenRevogado;
import dac.ufpr.Auth.repository.RevokedTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class TokenService {

    @Value("${jwt.secret}")
    private String key;

    private final RevokedTokenRepository revokedTokenRepository;

    public boolean isTokenRevoked(String token) {
        return revokedTokenRepository.existsByToken(token);
    }


    public void invalidateToken(String token) {
        Date expirationDate = extractExpiration(token);

        TokenRevogado revoked = new TokenRevogado(
                null,
                token,
                expirationDate.toInstant(),
                Instant.now()
        );

        revokedTokenRepository.save(revoked);
    }

    public Date extractExpiration(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getExpiration();
    }

    public String extractEmail(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
}
