package org.ecmr.app.domain.contracts;

import java.util.Objects;

public class Issuer {
    private String identity;

    public Issuer(String identity) {
        this.identity = identity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Issuer issuer = (Issuer) o;
        return Objects.equals(identity, issuer.identity);
    }

    @Override
    public int hashCode() {

        return Objects.hash(identity);
    }

    public String getIdentity() {
        return identity;
    }
}
