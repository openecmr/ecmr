package org.ecmr.app.application.contracts;

import org.ecmr.app.application.contracts.data.ContractData;
import org.ecmr.app.domain.contracts.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class ContractsResource {
    private ContractRepository contractRepository;
    private IssuerService issuerService;

    public ContractsResource(ContractRepository contractRepository, IssuerService issuerService) {
        this.contractRepository = contractRepository;
        this.issuerService = issuerService;
    }

    public String createContract(ContractData request) {
        Issuer issuer = getIssuer();

        Contract contract = new Contract(
                new ContractId(UUID.randomUUID().toString()),
                issuer, request.getConsignor(), request.getConsignee(), request.getCarrier(),
                request.getDespatchLocation(), request.getDeliveryLocation(), request.getConsignment());

        contractRepository.save(contract);

        return contract.getContractId().getId();
    }

    public List<ContractData> listContractsForIssuer() {
        Issuer issuer = getIssuer();

        return convert(contractRepository.findByIssuer(issuer));
    }

    private List<ContractData> convert(List<Contract> byIssuer) {
        return Collections.emptyList();
    }

    private Issuer getIssuer() {
        return issuerService.issuerFromIdentity("identity");
    }
}
