package tr.akb.price_tracker_backend.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import tr.akb.price_tracker_backend.entity.User;

@Repository
public class UserRepository {

    private final DynamoDbTable<User> userTable;

    @Autowired
    public UserRepository(DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        this.userTable = dynamoDbEnhancedClient.table("Users", TableSchema.fromBean(User.class));
    }

    public void save(User user) {
        userTable.putItem(user);
    }

    public User findByUsername(String username) {
        return userTable.getItem(r -> r.key(k -> k.partitionValue(username)));
    }

    public void update(User user) {
        userTable.updateItem(user);
    }
}
