package tr.akb.price_tracker_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;

import java.net.URI;

@Configuration
public class AwsConfig {

    @Value("${aws.region}")
    private String awsRegion;

    @Value("${aws.ses.credentials.access-key}")
    private String accessKey;

    @Value("${aws.ses.credentials.secret-key}")
    private String secretKey;

    @Value("${aws.ses.endpoint}")
    private String sesEndpoint;

    // Removed SesClient bean since we're using Gmail SMTP
//    @Bean
//    public SesClient sesClient() {
//        return SesClient.builder()
//                .region(Region.of(awsRegion))
//                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
//                .endpointOverride(URI.create(sesEndpoint))
//                .build();
//    }
}