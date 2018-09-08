package org.ecmr.app.application.contracts;

import org.ecmr.app.application.contracts.data.ContractData;
import org.ecmr.app.domain.contracts.Contract;
import org.junit.Test;

import static org.junit.Assert.*;

public class ContractsResourceTest {

    @Test
    public void createContract() {
        ContractsResource contractsResource = new ContractsResource();
        contractsResource.createContract(createRequest());


    }

    private ContractData createRequest() {
        return new ContractData();
    }
}