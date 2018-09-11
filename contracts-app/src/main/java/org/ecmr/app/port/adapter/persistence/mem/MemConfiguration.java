package org.ecmr.app.port.adapter.persistence.mem;

import org.ecmr.app.domain.contracts.ContractRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MemConfiguration {
    @Bean
    public ContractRepository contractRepository() {
        return new MemContractRepository();
    }
}
