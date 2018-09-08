package org.ecmr.app.port.adapter.persistence.mem;

import org.ecmr.app.domain.contracts.Contract;
import org.ecmr.app.domain.contracts.ContractId;
import org.ecmr.app.domain.contracts.ContractRepository;
import org.ecmr.app.domain.contracts.Issuer;

import java.util.*;

public class MemContractRepository implements ContractRepository {
    private Map<ContractId, Contract> contracts = new HashMap<>();

    @Override
    public void save(Contract contract) {
        contracts.put(contract.getContractId(), contract);
    }

    @Override
    public List<Contract> findByIssuer(Issuer issuer) {
        List<Contract> results = new ArrayList<>();

        for(Contract contract : contracts.values()) {
            if (contract.getIssuer().equals(issuer)) {
                results.add(contract);
            }
        }

        return results;
    }

    @Override
    public ContractId nextId() {
        return new ContractId(UUID.randomUUID().toString());
    }

    @Override
    public Contract findById(ContractId contractId) {
        return contracts.get(contractId);
    }
}
