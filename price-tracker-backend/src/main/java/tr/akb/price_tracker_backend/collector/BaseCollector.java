package tr.akb.price_tracker_backend.collector;

import tr.akb.price_tracker_backend.entity.ProductEntry;

public abstract class BaseCollector {

    public abstract Double collectPrice(ProductEntry productEntry) throws Exception;

    protected String getUrl(ProductEntry productEntry) {
        return productEntry.getUrl();
    }
}
