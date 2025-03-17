package tr.akb.price_tracker_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.akb.price_tracker_backend.entity.PriceEntry;
import tr.akb.price_tracker_backend.entity.ProductEntry;
import tr.akb.price_tracker_backend.service.PriceEntryService;
import tr.akb.price_tracker_backend.service.PriceMonitoringService;
import tr.akb.price_tracker_backend.service.ProductEntryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/price-entries")
public class PriceEntryController {

    @Autowired
    PriceEntryService priceEntryService;

    @Autowired
    ProductEntryService productEntryService;

    @Autowired
    PriceMonitoringService priceMonitoringService;

    @Autowired
    public PriceEntryController(PriceEntryService priceEntryService) {
        this.priceEntryService = priceEntryService;
    }

    @GetMapping("/{userId}/{productId}")
    public ResponseEntity<List<PriceEntry>> getPriceHistory(
            @PathVariable String userId,
            @PathVariable Long productId) {
        String productEntryId = userId + "#" + productId;
        List<PriceEntry> priceEntries = priceEntryService.getPriceEntriesByProductId(productEntryId);
        return ResponseEntity.ok(priceEntries);
    }

    @PostMapping("/fetch/{userId}/{productId}")
    public ResponseEntity<PriceEntry> fetchPriceNow(
            @PathVariable String userId,
            @PathVariable Long productId) {
        Optional<ProductEntry> productEntryOpt = productEntryService.getProductEntry(userId, productId);
        if (productEntryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404 if product not found
        }

        PriceEntry priceEntry = priceMonitoringService.fetchPriceNow(userId, productId);
        if (priceEntry != null) {
            return ResponseEntity.ok(priceEntry); // 200 with the new price entry
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 500 if fetch fails
        }
    }

}
