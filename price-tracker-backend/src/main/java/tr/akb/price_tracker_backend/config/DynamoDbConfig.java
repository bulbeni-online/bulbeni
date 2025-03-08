package tr.akb.price_tracker_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;
import software.amazon.awssdk.services.dynamodb.waiters.DynamoDbWaiter;

import java.net.URI;

@Configuration
public class DynamoDbConfig {

    @Value("${dynamodb.endpoint}")
    private String dynamoDbEndpoint;

    @Value("${aws.region}")
    private String awsRegion;

    @Value("${aws.credentials.access-key}")
    private String accessKey;

    @Value("${aws.credentials.secret-key}")
    private String secretKey;

    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient() {
        DynamoDbClient dynamoDbClient = DynamoDbClient.builder()
                .region(Region.of(awsRegion)) // Set your region
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .endpointOverride(URI.create(dynamoDbEndpoint))
                .build();

        // Create tables if they don’t exist
        createTableIfNotExists(dynamoDbClient, "ProductEntry",
                "userId", ScalarAttributeType.S,
                "id", ScalarAttributeType.N);
        createTableIfNotExists(dynamoDbClient, "PriceEntry",
                "productEntryId", ScalarAttributeType.S,
                "timestamp", ScalarAttributeType.S);

        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }

    private void createTableIfNotExists(DynamoDbClient dynamoDbClient, String tableName,
                                        String partitionKeyName, ScalarAttributeType partitionKeyType,
                                        String sortKeyName, ScalarAttributeType sortKeyType) {
        try {
            // Check if table exists
            dynamoDbClient.describeTable(DescribeTableRequest.builder()
                    .tableName(tableName)
                    .build());
            System.out.println(tableName + " table already exists.");
        } catch (ResourceNotFoundException e) {
            // Table doesn’t exist, create it
            System.out.println("Creating " + tableName + " table...");
            dynamoDbClient.createTable(CreateTableRequest.builder()
                    .tableName(tableName)
                    .attributeDefinitions(
                            AttributeDefinition.builder()
                                    .attributeName(partitionKeyName)
                                    .attributeType(partitionKeyType)
                                    .build(),
                            AttributeDefinition.builder()
                                    .attributeName(sortKeyName)
                                    .attributeType(sortKeyType)
                                    .build()
                    )
                    .keySchema(
                            KeySchemaElement.builder()
                                    .attributeName(partitionKeyName)
                                    .keyType(KeyType.HASH)
                                    .build(),
                            KeySchemaElement.builder()
                                    .attributeName(sortKeyName)
                                    .keyType(KeyType.RANGE)
                                    .build()
                    )
                    .billingMode(BillingMode.PAY_PER_REQUEST)
                    .build());

            // Wait until the table is active
            try (DynamoDbWaiter waiter = DynamoDbWaiter.builder().client(dynamoDbClient).build()) {
                waiter.waitUntilTableExists(DescribeTableRequest.builder()
                        .tableName(tableName)
                        .build());
                System.out.println(tableName + " table created successfully.");
            } catch (Exception waitException) {
                System.err.println("Failed to wait for " + tableName + " table creation: " + waitException.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error checking/creating " + tableName + " table: " + e.getMessage());
        }
    }
}
