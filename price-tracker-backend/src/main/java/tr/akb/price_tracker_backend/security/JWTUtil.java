package tr.akb.price_tracker_backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

public class JWTUtil {

    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    // Token expiration time (e.g., 1 hour)
    private static final long EXPIRATION_TIME = 3600000;  // 1 hour in milliseconds

    // Method to generate JWT token
    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    // Method to parse JWT token and retrieve claims
    public static Claims parseToken(String token) throws JwtException {
        return Jwts.parser()  // Updated to use parserBuilder() from jjwt-api
                .setSigningKey(SECRET_KEY)  // Set the signing key for validation
                .build()
                .parseClaimsJws(token)  // Parse the JWT to get the claims
                .getBody();
    }

    // Method to get the username from the token
    public static String getUsernameFromToken(String token) {
        return parseToken(token).getSubject();
    }

    // Method to validate if the token is expired
    public static boolean isTokenExpired(String token) {
        return parseToken(token).getExpiration().before(new Date());
    }
}
