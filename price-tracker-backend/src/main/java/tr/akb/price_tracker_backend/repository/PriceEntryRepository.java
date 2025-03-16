package tr.akb.price_tracker_backend.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import tr.akb.price_tracker_backend.entity.PriceEntry;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class PriceEntryRepository {

    private final DynamoDbTable<PriceEntry> priceEntryTable;

    @Autowired
    public PriceEntryRepository(DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        this.priceEntryTable = dynamoDbEnhancedClient.table("PriceEntry",
                TableSchema.fromBean(PriceEntry.class));
    }

    public void save(PriceEntry priceEntry) {
        priceEntryTable.putItem(priceEntry);
    }

    public List<PriceEntry> findByProductEntryId(String productEntryId) {
        Key key = Key.builder().partitionValue(productEntryId).build();
        return priceEntryTable.query(r -> r.queryConditional(QueryConditional.keyEqualTo(key)))
                .items()
                .stream()
                .collect(Collectors.toList());
    }

    public Optional<PriceEntry> findByProductEntryIdAndTimestamp(String productEntryId, String timestamp) {
        Key key = Key.builder().partitionValue(productEntryId).sortValue(timestamp).build();
        return Optional.ofNullable(priceEntryTable.getItem(key));
    }

    public Optional<PriceEntry> deleteByProductEntryIdAndTimestamp(String productEntryId, String timestamp) {
        Key key = Key.builder().partitionValue(productEntryId).sortValue(timestamp).build();
        return Optional.ofNullable(priceEntryTable.deleteItem(key));
    }
}