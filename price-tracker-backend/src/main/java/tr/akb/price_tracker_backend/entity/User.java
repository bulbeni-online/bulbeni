package tr.akb.price_tracker_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class User {

    private String username;
    private String email;
    private String passwordHash;
    private boolean isVerified;
    private String confirmationToken;
    private String createdAt;

    @DynamoDbPartitionKey
    public String getUsername() {
        return username;
    }


}
