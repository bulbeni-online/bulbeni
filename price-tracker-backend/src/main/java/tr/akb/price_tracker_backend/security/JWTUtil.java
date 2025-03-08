package tr.akb.price_tracker_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.util.Date;

@Component
public class JWTUtil {

    private static final long EXPIRATION_TIME = 3600000; // 1 hour in milliseconds

    @Value("${jwt.secret}")
    private String secretKey; // Inject from application.yaml

    private SecretKeySpec getSecretKey() {
        return new SecretKeySpec(secretKey.getBytes(), SignatureAlgorithm.HS256.getJcaName());
    }

    // Method to generate JWT token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Method to parse JWT token and retrieve claims
    public Claims parseToken(String token) {
        try {
            return Jwts.parser() // Use parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("Exception occurred while parsing token: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // Method to get the username from the token
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // Method to validate if the token is expired
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }
}