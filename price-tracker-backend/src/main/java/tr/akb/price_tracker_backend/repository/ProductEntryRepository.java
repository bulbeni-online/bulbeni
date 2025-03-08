package tr.akb.price_tracker_backend.repository;

import tr.akb.price_tracker_backend.entity.ProductEntry;

import java.util.List;
import java.util.Optional;

public interface ProductEntryRepository {

    void save(ProductEntry productEntry);

    List<ProductEntry> findByUserId(String userId);

    Optional<ProductEntry> findByUserIdAndId(String userId, Long id);

    Optional<ProductEntry> deleteByUserIdAndId(String userId, Long id);

    List<ProductEntry> findAll();
}
