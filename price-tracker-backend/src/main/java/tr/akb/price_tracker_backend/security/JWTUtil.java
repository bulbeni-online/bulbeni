package tr.akb.price_tracker_backend.security;

import io.jsonwebtoken.*;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Date;

@Component
public class JWTUtil {

    // Token expiration time (e.g., 1 hour)
    private static final long EXPIRATION_TIME = 3600000;  // 1 hour in milliseconds

    // Static secret key for the entire application lifecycle
    private static SecretKey SECRET_KEY;

    // Method to generate a secure secret key using AES-256
    private static void initializeSecretKey() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            SecureRandom secureRandom = new SecureRandom();
            keyGen.init(256, secureRandom); // 256-bit key length for AES
            SECRET_KEY = keyGen.generateKey(); // No need to cast, SecretKeySpec handles it internally
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate secret key", e);
        }
    }

    // Method to generate JWT token
    public static String generateToken(String username) {
       return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // Use HS256 for HMAC with AES-256
                .compact();
    }

    // Method to parse JWT token and retrieve claims
    public static Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token).getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // Method to get the username from the token
    public static String getUsernameFromToken(String token) {
        try {
            Claims claimsJws = parseToken(token);
            return claimsJws.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // Method to validate if the token is expired
    public static boolean isTokenExpired(String token) {
        try {
            Claims claimsJws = parseToken(token);
            return claimsJws.getExpiration().before(new Date());
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // Bean to provide the secret key for Spring contexts
    @Bean
    public SecretKey secretKey() {
        if (SECRET_KEY == null) {
            initializeSecretKey();
        }
        return SECRET_KEY;
    }
}
