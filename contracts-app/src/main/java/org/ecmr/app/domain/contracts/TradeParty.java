package org.ecmr.app.domain.contracts;

import java.util.Objects;

public class TradeParty {
    private String name;

    public TradeParty(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TradeParty that = (TradeParty) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {

        return Objects.hash(name);
    }
}
