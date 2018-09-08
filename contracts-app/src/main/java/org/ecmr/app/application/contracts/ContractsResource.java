package org.ecmr.app.application.contracts;

import org.ecmr.app.domain.contracts.*;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ContractsResource {
    private ContractRepository contractRepository;
    private IssuerService issuerService;

    public ContractsResource(ContractRepository contractRepository, IssuerService issuerService) {
        this.contractRepository = contractRepository;
        this.issuerService = issuerService;
    }

    public String createContract(ContractRequest request) {
        Issuer issuer = getIssuer();

        ContractId contractId = contractRepository.nextId();
        Contract contract = new Contract(contractId, issuer,
                request.getConsignor(), request.getConsignee(), request.getCarrier(),
                request.getDespatchLocation(), request.getDeliveryLocation(),
                request.getConsignment());

        contractRepository.save(contract);

        return contractId.getId();
    }

    public List<Contract> listContractsForIssuer() {
        Issuer issuer = getIssuer();

        return contractRepository.findByIssuer(issuer);
    }

    private Issuer getIssuer() {
        return issuerService.issuerFromIdentity("identity");
    }
}
