package tr.akb.price_tracker_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tr.akb.price_tracker_backend.entity.User;
import tr.akb.price_tracker_backend.repository.UserRepository;
import tr.akb.price_tracker_backend.util.EmailUtil;
import tr.akb.price_tracker_backend.util.EncryptionUtil;

import java.time.Instant;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EncryptionUtil encryptionUtil;
    private final EmailUtil emailUtil;

    @Autowired
    public UserService(UserRepository userRepository, EncryptionUtil encryptionUtil, EmailUtil emailUtil) {
        this.userRepository = userRepository;
        this.encryptionUtil = encryptionUtil;
        this.emailUtil = emailUtil;
    }

    public User register(String username, String email, String password) {
        if (userRepository.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username already taken");
        }

        String passwordHash = encryptionUtil.hashPassword(password);
        String confirmationToken = emailUtil.generateConfirmationToken();
        User user = new User(username, email, passwordHash, false, confirmationToken, Instant.now().toString());

        userRepository.save(user);
        emailUtil.sendConfirmationEmail(email, username, confirmationToken);

        return user;
    }

    public void verifyEmail(String username, String token) {
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getConfirmationToken().equals(token)) {
            throw new IllegalArgumentException("Invalid or expired token");
        }

        user.setVerified(true);
        user.setConfirmationToken(null);
        userRepository.update(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null || !encryptionUtil.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        if (!user.isVerified()) {
            throw new IllegalStateException("Please verify your email first");
        }
        return user;
    }

    public User getUserByUsername(String username){
        User user =  userRepository.findByUsername(username);
        if (user == null)
            throw new IllegalArgumentException("User:" + username + " not found");

        return user;
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password cannot be null or empty");
        }

        User user = userRepository.findByUsername(username);
        if (user == null || !encryptionUtil.matches(oldPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid current password");
        }

        String newPasswordHash = encryptionUtil.hashPassword(newPassword);
        user.setPasswordHash(newPasswordHash);
        userRepository.update(user);

        // Notify user
        emailUtil.sendEmail(user.getEmail(), "Şifreniz Değiştirildi - " + user.getUsername(),
                user.getUsername() + ": Şifreniz başarıyla güncellendi.",
                "<h1>"+ user.getUsername() +"</h1> : <h2>Şifreniz Değiştirildi</h2><p>Hesabınızın şifresi başarıyla güncellendi.</p>");
    }
}