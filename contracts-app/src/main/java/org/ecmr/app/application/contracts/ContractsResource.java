package org.ecmr.app.application.contracts;

import org.ecmr.app.domain.contracts.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("contracts")
public class ContractsResource {
    private ContractRepository contractRepository;
    private IssuerService issuerService;

    public ContractsResource(ContractRepository contractRepository, IssuerService issuerService) {
        this.contractRepository = contractRepository;
        this.issuerService = issuerService;
    }

    @PostMapping
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

    @GetMapping
    public List<Contract> listContractsForIssuer() {
        Issuer issuer = getIssuer();

        return contractRepository.findByIssuer(issuer);
    }

    private Issuer getIssuer() {
        return issuerService.issuerFromIdentity("identity");
    }
}
