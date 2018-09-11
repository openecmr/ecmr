package org.ecmr.app.port.adapter.service.mock;

import org.ecmr.app.domain.contracts.IssuerService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MockConfiguration {
    @Bean
    public IssuerService issuerService() {
        return new MockIssuerService();
    }
}
