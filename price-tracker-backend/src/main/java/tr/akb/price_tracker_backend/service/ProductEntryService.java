package tr.akb.price_tracker_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tr.akb.price_tracker_backend.entity.ProductEntry;
import tr.akb.price_tracker_backend.repository.ProductEntryRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ProductEntryService {

    private final ProductEntryRepository productEntryRepository;

    @Autowired
    public ProductEntryService(ProductEntryRepository productEntryRepository) {
        this.productEntryRepository = productEntryRepository;
    }

    public ProductEntry createProductEntry(ProductEntry productEntry) {
        productEntry.setId(System.currentTimeMillis()); // Example of auto-generated ID
        productEntry.setCreatedAt(Instant.now().toString());
        productEntry.setUpdatedAt(Instant.now().toString());
        productEntryRepository.save(productEntry);
        return productEntry;
    }

    public List<ProductEntry> getProductEntriesByUserId(String userId) {
        return productEntryRepository.findByUserId(userId);
    }

    public Optional<ProductEntry> getProductEntry(String userId, Long id) {
        return productEntryRepository.findByUserIdAndId(userId, id);
    }

    public Optional<ProductEntry> deleteProductEntry(String userId, Long id) {
        return productEntryRepository.deleteByUserIdAndId(userId, id);
    }

    public Optional<ProductEntry> updateProductEntry(ProductEntry productEntry) {
        Optional<ProductEntry> existingEntry = productEntryRepository.findByUserIdAndId(
                productEntry.getUserId(),
                productEntry.getId()
        );

        if (existingEntry.isPresent()) {
            ProductEntry entryToUpdate = existingEntry.get();
            entryToUpdate.setName(productEntry.getName());
            entryToUpdate.setUrl(productEntry.getUrl());
            entryToUpdate.setProductType(productEntry.getProductType());
            productEntryRepository.save(entryToUpdate);
            return Optional.of(productEntry);
        }
        return Optional.empty();
    }

}
