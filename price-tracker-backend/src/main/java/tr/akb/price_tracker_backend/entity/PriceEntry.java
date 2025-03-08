package tr.akb.price_tracker_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class PriceEntry {

    private String productEntryId; // Composite key: userId#productId
    private String timestamp; // e.g., "2025-03-08T12:00:00Z"
    private Double price;
    private String currency;

    @DynamoDbPartitionKey
    public String getProductEntryId() {
        return productEntryId;
    }

    @DynamoDbSortKey
    public String getTimestamp() {
        return timestamp;
    }
}