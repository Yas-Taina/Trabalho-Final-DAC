package dac.ufpr.gerente.security;

import org.springframework.boot.autoconfigure.integration.IntegrationProperties.RSocket.Server;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @org.springframework.beans.factory.annotation.Value("${jwt.secret}")
    private String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws java.io.IOException, ServletException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey.getBytes())
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();
            String role = claims.get("role", String.class);

            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null,
                    authorities);

        } catch (JwtException e) {
            throw new RuntimeException("Token JWT inválido ou expirado", e);
        }

        filterChain.doFilter(request, response);
    }
}
