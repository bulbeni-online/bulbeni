package tr.akb.price_tracker_backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tr.akb.price_tracker_backend.collector.BaseCollector;
import tr.akb.price_tracker_backend.collector.CollectorFactory;
import tr.akb.price_tracker_backend.entity.PriceEntry;
import tr.akb.price_tracker_backend.entity.ProductEntry;
import tr.akb.price_tracker_backend.entity.ProductType;
import tr.akb.price_tracker_backend.repository.PriceEntryRepository;
import tr.akb.price_tracker_backend.repository.ProductEntryRepository;

import java.time.Instant;
import java.util.List;

@Service
public class PriceMonitoringService {
    private static final Logger logger = LoggerFactory.getLogger(PriceMonitoringService.class);

    private final ProductEntryRepository productEntryRepository;
    private final PriceEntryRepository priceEntryRepository;
    private final CollectorFactory collectorFactory;

    public PriceMonitoringService(ProductEntryRepository productEntryRepository,
                                  PriceEntryRepository priceEntryRepository,
                                  CollectorFactory collectorFactory) {
        this.productEntryRepository = productEntryRepository;
        this.priceEntryRepository = priceEntryRepository;
        this.collectorFactory = collectorFactory;
    }

    @Scheduled(fixedRate = 3600000) // Runs every hour
    public void monitorProductEntries() {
        // Fetch all ProductEntry records (you might want to paginate or filter by user in a real app)
        List<ProductEntry> allEntries = productEntryRepository.findAll();
        if (allEntries == null || allEntries.isEmpty()) {
            logger.info("No product entries found to monitor.");
            return;
        }

        for (ProductEntry entry : allEntries) {
            if (!ProductType.URL.equals(entry.getProductType()) || entry.getUrl() == null) {
                logger.debug("Skipping entry {}: Not a URL type or URL is null", entry.getId());
                continue;
            }

            try {
                BaseCollector collector = collectorFactory.getCollector(entry);
                Double price = collector.collectPrice(entry);
                if (price != null) {
                    String productEntryId = entry.getUserId() + "#" + entry.getId();
                    PriceEntry priceEntry = new PriceEntry(
                            productEntryId,
                            Instant.now().toString(),
                            price,
                            "TRY" // Assuming Turkish Lira
                    );
                    priceEntryRepository.save(priceEntry);
                    logger.info("Price collected for {}: {}", entry.getUrl(), price);
                } else {
                    logger.warn("No price collected for {}", entry.getUrl());
                }
            } catch (Exception e) {
                logger.error("Failed to collect price for {}: {}", entry.getUrl(), e.getMessage());
            }
        }
    }
}