package org.ecmr.app.application.contracts;

import org.ecmr.app.domain.contracts.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@JsonTest
public class ContractRequestJsonTest {
    @Autowired
    private JacksonTester<ContractRequest> contractRequestTester;

    @Autowired
    private JacksonTester<Contract> contractTester;

    @Test
    public void request() throws IOException {
        ContractRequest contractRequest = contractRequestTester.readObject("/request.json");

        assertNotNull(contractRequest.getCarrier().getName());
    }

    @Test
    public void response() throws IOException {
        Contract contract = new Contract(
                new ContractId("5b470fdf-6e38-46b5-a906-3e0939f77302"),
                new Issuer("identity"), new TradeParty("consignor"), new TradeParty("consignee"),
                new TradeParty("carrier"), new Location("address 1"), new Location("address 2"),
                new Consignment("consignment"));

        assertThat(contractTester.write(contract)).extractingJsonPathValue("@.consignor.name").isEqualTo("consignor");
    }
}
