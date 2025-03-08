package tr.akb.price_tracker_backend.repository;

import tr.akb.price_tracker_backend.entity.PriceEntry;

import java.util.List;
import java.util.Optional;

public interface PriceEntryRepository {

    void save(PriceEntry priceEntry);

    List<PriceEntry> findByProductEntryId(String productEntryId);

    Optional<PriceEntry> findByProductEntryIdAndTimestamp(String productEntryId, String timestamp);

    Optional<PriceEntry> deleteByProductEntryIdAndTimestamp(String productEntryId, String timestamp);

}
