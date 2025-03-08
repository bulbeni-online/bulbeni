package tr.akb.price_tracker_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.akb.price_tracker_backend.entity.PriceEntry;
import tr.akb.price_tracker_backend.entity.ProductEntry;
import tr.akb.price_tracker_backend.service.PriceEntryService;
import tr.akb.price_tracker_backend.service.ProductEntryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/price-entries")
public class PriceEntryController {

    @Autowired
    PriceEntryService priceEntryService;

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

}
