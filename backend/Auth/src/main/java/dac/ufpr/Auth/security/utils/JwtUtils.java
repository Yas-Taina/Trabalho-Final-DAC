package dac.ufpr.Auth.security.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;
import java.util.Map;


@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String key;

    @Value("${jwt.expiration}")
    private long expiration;


    public String generateToken(String subject, String role, Map<String, Object> extraClaims) {
        return Jwts.builder()
                .setSubject(subject)
                .claim("role", role)
                .addClaims(extraClaims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(key.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }
}
