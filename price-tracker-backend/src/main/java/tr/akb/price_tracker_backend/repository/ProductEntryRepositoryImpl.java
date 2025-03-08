package tr.akb.price_tracker_backend.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import tr.akb.price_tracker_backend.entity.ProductEntry;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ProductEntryRepositoryImpl implements ProductEntryRepository {

    private final DynamoDbEnhancedClient dynamoDbEnhancedClient;
    private final DynamoDbTable<ProductEntry> productEntryTable;

    @Autowired
    public ProductEntryRepositoryImpl(DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        this.dynamoDbEnhancedClient = dynamoDbEnhancedClient;
        this.productEntryTable = dynamoDbEnhancedClient.table("ProductEntry",
                TableSchema.fromBean(ProductEntry.class));
    }

    @Override
    public void save(ProductEntry productEntry) {
        productEntryTable.putItem(productEntry);
    }

    @Override
    public List<ProductEntry> findByUserId(String userId) {
        Key key = Key.builder().partitionValue(userId).build();
        return productEntryTable.query( r -> r.queryConditional(QueryConditional.keyEqualTo(key)))
                .items()
                .stream()
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductEntry> findByUserIdAndId(String userId, Long id) {
        Key key = Key.builder().partitionValue(userId).sortValue(id).build();
        return Optional.ofNullable(productEntryTable.getItem(key));
    }

    @Override
    public Optional<ProductEntry> deleteByUserIdAndId(String userId, Long id) {
        Key key = Key.builder().partitionValue(userId).sortValue(id).build();
        return Optional.ofNullable(productEntryTable.deleteItem(key));
    }

    @Override
    public List<ProductEntry> findAll() {
        return productEntryTable.scan()
                .items()
                .stream()
                .collect(Collectors.toList());
    }
}
