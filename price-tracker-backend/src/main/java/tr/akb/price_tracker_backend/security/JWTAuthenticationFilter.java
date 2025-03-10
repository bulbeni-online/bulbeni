package tr.akb.price_tracker_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JWTAuthenticationFilter.class);
    private static final AntPathRequestMatcher OPTIONS_REQUEST_MATCHER = new AntPathRequestMatcher("/**", "OPTIONS");

    private final JWTUtil jwtUtil;

    public JWTAuthenticationFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // Skip OPTIONS requests
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            logger.debug("Skipping OPTIONS request: {}", request.getRequestURI());
            chain.doFilter(request, response);
            return;
        }

        String token = request.getHeader("Authorization");
        logger.debug("Authorization Header: {}", token);


        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            logger.debug("Token: {}", token);
            try {
                Claims claims = jwtUtil.parseToken(token);
                String username = claims.getSubject();
                logger.debug("Username from token: {}", username);

                UserDetails userDetails = User.withUsername(username)
                        .password("")
                        .authorities("USER")
                        .build();

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // ✅ Store authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (JwtException e) {
                logger.error("JWT Exception: {}", e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }
        }

        chain.doFilter(request, response);

    }

}