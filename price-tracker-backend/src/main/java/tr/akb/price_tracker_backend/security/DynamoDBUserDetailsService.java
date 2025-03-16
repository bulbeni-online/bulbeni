package tr.akb.price_tracker_backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import tr.akb.price_tracker_backend.entity.User;
import tr.akb.price_tracker_backend.repository.UserRepository;

public class DynamoDBUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DynamoDBUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (user == null)
            throw new UsernameNotFoundException("User not found :" + username);

        if (!user.isVerified())
            throw new UsernameNotFoundException("User email not verified: " + username);

        return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .roles("USER")
                .build();
    }
}
