package tr.akb.price_tracker_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tr.akb.price_tracker_backend.entity.PriceEntry;
import tr.akb.price_tracker_backend.repository.PriceEntryRepository;

import java.util.List;

@Service
public class PriceEntryService {

    private final PriceEntryRepository priceEntryRepository;

    @Autowired
    public PriceEntryService(PriceEntryRepository priceEntryRepository) {
        this.priceEntryRepository = priceEntryRepository;
    }

    public List<PriceEntry> getPriceEntriesByProductId(String productEntryId) {
        return priceEntryRepository.findByProductEntryId(productEntryId);
    }

}
