package org.ecmr.app.domain.contracts;

public class Location {
    private String address;

    public Location(String address) {
        this.address = address;
    }

    public String getAddress() {
        return address;
    }
}
