package tr.akb.price_tracker_backend.collector;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import tr.akb.price_tracker_backend.entity.ProductEntry;

public class UnknownCollector extends BaseCollector {

    @Override
    public Double collectPrice(ProductEntry productEntry) throws Exception {

        return Double.valueOf(0);
    }
}

