package org.ecmr.app.domain.contracts;

public class Consignment {
    private String description;

    public Consignment(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
