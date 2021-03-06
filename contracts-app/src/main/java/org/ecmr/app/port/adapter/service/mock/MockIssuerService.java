package org.ecmr.app.port.adapter.service.mock;

import org.ecmr.app.domain.contracts.Issuer;
import org.ecmr.app.domain.contracts.IssuerService;

public class MockIssuerService  implements IssuerService {

    @Override
    public Issuer issuerFromIdentity(String identity) {
        return new Issuer(identity);
    }
}
