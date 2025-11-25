package com.chopadelab.core.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.core.GrantedAuthority; // <-- Removed (unused)
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
// import java.util.Collection; // <-- Removed (unused)
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    // 24 hours expiration (adjust as needed)
    private static final long EXPIRATION = 1000L * 60 * 60 * 24;

    private SecretKeySpec getSigningKey() {
        return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    /**
     * Generate token including roles from UserDetails.
     */
    public String generateToken(UserDetails userDetails) {
        List<String> roles = userDetails.getAuthorities().stream()
                .map(ga -> {
                    String a = ga.getAuthority();
                    if (a == null) return "";
                    // Ensure roles are stored as "ROLE_USER", "ROLE_ADMIN" etc.
                    return a.startsWith("ROLE_") ? a : "ROLE_" + a;
                })
                .toList();

        // --- THIS IS THE FIX for deprecated methods ---
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION);

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate) // Use .expiration()
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @SuppressWarnings("unchecked") // This is fine
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List<?>) {
            return ((List<?>) rolesObj).stream()
                    .map(Object::toString)
                    .toList();
        }
        return List.of();
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid or expired JWT", e);
        }
    }


    private boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration != null && expiration.before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
