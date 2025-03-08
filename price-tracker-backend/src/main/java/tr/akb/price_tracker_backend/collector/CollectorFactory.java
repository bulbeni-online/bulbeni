package tr.akb.price_tracker_backend.collector;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import tr.akb.price_tracker_backend.entity.ProductEntry;

import java.util.Map;

@Component
public class CollectorFactory {
    private final ObjectMapper objectMapper;

    public CollectorFactory(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public BaseCollector getCollector(ProductEntry productEntry) {
        try {
            // Parse productTypeProperties JSON
            String propertiesJson = productEntry.getProductTypeProperties();
            Map<String, String> properties = objectMapper.readValue(propertiesJson, Map.class);
            String host = properties.getOrDefault("host", ProductEntry.PRODUCT_URL_HOST_UNKNOWN);

            switch (host) {
                case ProductEntry.PRODUCT_URL_HOST_HEPSIBURADA:
                    return new HepsiburadaCollector();
                case ProductEntry.PRODUCT_URL_HOST_PTTAVM:
                    return new PttavmCollector();
                case ProductEntry.PRODUCT_URL_HOST_UNKNOWN:
                default:
                    return new UnknownCollector();
            }
        } catch (Exception e) {
            // Fallback to unknown collector if parsing fails
            return new UnknownCollector();
        }
    }
}