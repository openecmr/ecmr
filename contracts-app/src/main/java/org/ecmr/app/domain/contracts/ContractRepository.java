package org.ecmr.app.domain.contracts;

import java.util.List;

public interface ContractRepository {
    void save(Contract contract);

    List<Contract> findByIssuer(Issuer issuer);
}
