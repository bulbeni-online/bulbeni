package tr.akb.price_tracker_backend.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;
import tr.akb.price_tracker_backend.util.ProductTypeDeserializer;

import java.util.Locale;

@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class ProductEntry {

    private Long id;
    private String userId;
    private String name;
    private String url;
    private String notificationUrl;

    @JsonDeserialize(using = ProductTypeDeserializer.class)
    private ProductType productType;

    private String productTypeProperties;
    private String createdAt;
    private String updatedAt;

    public static final String PRODUCT_URL_HOST_UNKNOWN = "--unknown--";
    public static final String PRODUCT_URL_HOST_HEPSIBURADA = "hepsiburada";
    public static final String PRODUCT_URL_HOST_PTTAVM = "pttavm";

    @DynamoDbPartitionKey
    public String getUserId() {
        return userId;
    }

    @DynamoDbSortKey
    public Long getId() {
        return id;
    }

    public void updateProductProperties() {

        if (ProductType.URL.equals(productType)) {
            if (url.toLowerCase(Locale.ENGLISH).contains(PRODUCT_URL_HOST_HEPSIBURADA))
                setProductTypeProperties("{ \"host\": \"" +  PRODUCT_URL_HOST_HEPSIBURADA + "\" }");
            else if (url.toLowerCase(Locale.ENGLISH).contains(PRODUCT_URL_HOST_PTTAVM))
                setProductTypeProperties("{ \"host\": \"" +  PRODUCT_URL_HOST_PTTAVM + "\" }");
            else
                setProductTypeProperties("{ \"host\": \"" +  PRODUCT_URL_HOST_UNKNOWN + "\" }");
        }else{
            setProductTypeProperties("{ }");
        }

    }
}
