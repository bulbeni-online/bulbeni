package tr.akb.price_tracker_backend.collector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tr.akb.price_tracker_backend.entity.ProductEntry;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class CollectorFactory {

    private final Map<String, BaseCollector> collectorMap;
    private final BaseCollector defaultCollector;

    @Autowired
    public CollectorFactory(List<BaseCollector> collectors) {
        //Build map of host -> collector
        this.collectorMap = collectors.stream()
                .collect(Collectors.toMap(BaseCollector::getHost, Function.identity()));

        //Set default collector
        BaseCollector unknownCollector = new UnknownCollector();
        this.defaultCollector = collectorMap.getOrDefault(unknownCollector.getHost(), unknownCollector);
    }

    public BaseCollector getCollector(ProductEntry productEntry) {
        if (productEntry == null || productEntry.getUrl() == null) {
            return defaultCollector;
        }

        // Generic URL-to-host logic
        String url = productEntry.getUrl().toLowerCase(Locale.ENGLISH);
        String host = extractHostFromUrl(url);

        // Return matching collector or default
        return collectorMap.getOrDefault(host, defaultCollector);
    }

    public String extractHostFromUrl(String url) {
        try {
            java.net.URL parsedUrl = new java.net.URL(url);
            String domain = parsedUrl.getHost().toLowerCase(Locale.ENGLISH);
            return collectorMap.keySet().stream()
                    .filter(domain::contains)
                    .findFirst()
                    .orElse(defaultCollector.getHost());
        } catch (Exception e) {
            return defaultCollector.getHost();
        }
    }
}