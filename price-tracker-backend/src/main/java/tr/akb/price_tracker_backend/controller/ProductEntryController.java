package tr.akb.price_tracker_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.akb.price_tracker_backend.entity.ProductEntry;
import tr.akb.price_tracker_backend.service.ProductEntryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-entries")
public class ProductEntryController {

    @Autowired
    ProductEntryService productEntryService;

    @Autowired
    public ProductEntryController(ProductEntryService productEntryService) {
        this.productEntryService = productEntryService;
    }

    @PostMapping
    public ResponseEntity<ProductEntry> createProductEntry(@RequestBody ProductEntry productEntry) {
        ProductEntry createdEntry = productEntryService.createProductEntry(productEntry);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEntry);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ProductEntry>> getProductEntriesByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(productEntryService.getProductEntriesByUserId(userId));
    }

    @GetMapping("/{userId}/{id}")
    public ResponseEntity<ProductEntry> getProductEntry(@PathVariable String userId, @PathVariable Long id) {
        return productEntryService.getProductEntry(userId, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity<Void> deleteProductEntry(@PathVariable String userId, @PathVariable Long id) {
        Optional<ProductEntry> optionalProductEntry = productEntryService.deleteProductEntry(userId, id);

        if (optionalProductEntry.isEmpty())
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/{id}")
    public ResponseEntity<ProductEntry> updateProductEntry(
            @PathVariable String userId,
            @PathVariable Long id,
            @RequestBody ProductEntry productEntry) {
        try {
            // Ensure the userId matches the path
            productEntry.setUserId(userId);
            productEntry.setId(id);

            Optional<ProductEntry> updatedEntry = productEntryService.updateProductEntry(productEntry);
            return updatedEntry
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
