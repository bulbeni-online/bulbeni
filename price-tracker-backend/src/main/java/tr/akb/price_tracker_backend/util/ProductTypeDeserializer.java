package tr.akb.price_tracker_backend.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import tr.akb.price_tracker_backend.entity.ProductType;

import java.io.IOException;

public class ProductTypeDeserializer extends JsonDeserializer<ProductType> {
    @Override
    public ProductType deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (value == null || value.isEmpty()) {
            return ProductType.None;
        }
        return ProductType.valueOf(value);
    }
}