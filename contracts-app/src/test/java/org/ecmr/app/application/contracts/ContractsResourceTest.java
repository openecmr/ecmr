package org.ecmr.app.application.contracts;

import org.ecmr.app.domain.contracts.*;
import org.ecmr.app.port.adapter.persistence.mem.MemContractRepository;
import org.ecmr.app.port.adapter.service.mock.MockIssuerService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ContractsResourceTest {
    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ContractsResource contractsResource;

    @Autowired
    private IssuerService issuerService;

    @Test
    public void retrieveContract() {
        ContractRequest request = createRequest();
        String contractId = contractsResource.createContract(request);

        Contract contract = contractRepository.findById(new ContractId(contractId));

        assertEquals(contract.getCarrier(), request.getCarrier());
    }

    @Test
    public void retrieveContracts() {
        ContractRequest request = createRequest();
        String contractId = contractsResource.createContract(request);

        List<Contract> contracts = contractRepository.findByIssuer(issuerService.issuerFromIdentity("identity"));

        assertThat(contracts).extracting(Contract::getContractId).contains(new ContractId(contractId));
    }

    private ContractRequest createRequest() {
        return new ContractRequest(
                new TradeParty("C. Consignor"),
                new TradeParty("C. Consignee"),
                new TradeParty("C. Carrier"),
                new Location("Van Stavoren Products\nVan der vorenstraat 22\n3123 AA Rotterdam"),
                new Location("IJswinkel Hoogstraat"),
                new Consignment("56 dozen crusty king wafels\n22 pakken suiker"));
    }

    @TestConfiguration
    public static class Configuration {

        @Bean
        public ContractRepository contractRepository() {
            return new MemContractRepository();
        }

        @Bean
        public IssuerService issuerService() {
            return new MockIssuerService();
        }
    }
}