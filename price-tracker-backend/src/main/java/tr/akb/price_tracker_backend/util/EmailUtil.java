package tr.akb.price_tracker_backend.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class EmailUtil {

    private final JavaMailSender mailSender;

    @Value("${mail.sender}")
    private String senderEmail;

    @Autowired
    public EmailUtil(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String generateConfirmationToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[20];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public void sendConfirmationEmail(String email, String username, String token) {
        String confirmationLink = "http://localhost:8080/api/auth/verify?username=" + username + "&token=" + token;
        sendEmail(email, "Hesabınızı Doğrulayın",
                "Hesabınızı doğrulamak için şu bağlantıya tıklayın: " + confirmationLink,
                "<h2>Hesabınızı Doğrulayın</h2><p>Hesabınızı etkinleştirmek için <a href=\"" + confirmationLink + "\">buraya tıklayın</a>.</p>");
    }

    public void sendEmail(String toEmail, String subject, String textBody, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(textBody, htmlBody); // textBody as fallback, htmlBody as primary

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}