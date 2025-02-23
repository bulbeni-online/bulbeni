package tr.akb.price_tracker_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.io.IOException;

@WebFilter(urlPatterns = "/api/*") // You can modify the URL pattern to filter only specific API endpoints
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {


    public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    // This method is invoked when we receive a request to authenticate the user
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String token = request.getHeader("Authorization"); // Get the token from the Authorization header

        try {

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // Remove "Bearer " prefix
                try {
                    // Validate the token and extract claims
                    Claims claims = JWTUtil.parseToken(token);
                    String username = claims.getSubject(); // Extract the username from the token

                    // Set authentication in Spring Security
                    UserDetails userDetails = User.withUsername(username).password("") // Empty password as it’s validated by JWT
                            .authorities("USER").build(); // You can add roles/authorities as needed

                    return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
                } catch (JwtException e) {
                    // Handle invalid token error (you can log it and return a 401 Unauthorized status)
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                }
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is missing or incorrect");
            }
        } catch (IOException ioException) {
            ioException.printStackTrace();
        }
        return null; // Return null to prevent the chain from proceeding if the token is invalid
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);
    }
}
