package org.ecmr.app.application.contracts;

import org.ecmr.app.domain.contracts.Consignment;
import org.ecmr.app.domain.contracts.Location;
import org.ecmr.app.domain.contracts.TradeParty;

public class ContractRequest {
    private TradeParty consignor;
    private TradeParty consignee;
    private TradeParty carrier;
    private Location despatchLocation;
    private Location deliveryLocation;
    private Consignment consignment;

    public ContractRequest(TradeParty consignor, TradeParty consignee, TradeParty carrier, Location despatchLocation, Location deliveryLocation, Consignment consignment) {
        this.consignor = consignor;
        this.consignee = consignee;
        this.carrier = carrier;
        this.despatchLocation = despatchLocation;
        this.deliveryLocation = deliveryLocation;
        this.consignment = consignment;
    }

    ContractRequest() {

    }

    public TradeParty getConsignor() {
        return consignor;
    }

    public void setConsignor(TradeParty consignor) {
        this.consignor = consignor;
    }

    public TradeParty getConsignee() {
        return consignee;
    }

    public void setConsignee(TradeParty consignee) {
        this.consignee = consignee;
    }

    public TradeParty getCarrier() {
        return carrier;
    }

    public void setCarrier(TradeParty carrier) {
        this.carrier = carrier;
    }

    public Location getDespatchLocation() {
        return despatchLocation;
    }

    public void setDespatchLocation(Location despatchLocation) {
        this.despatchLocation = despatchLocation;
    }

    public Location getDeliveryLocation() {
        return deliveryLocation;
    }

    public void setDeliveryLocation(Location deliveryLocation) {
        this.deliveryLocation = deliveryLocation;
    }

    public Consignment getConsignment() {
        return consignment;
    }

    public void setConsignment(Consignment consignment) {
        this.consignment = consignment;
    }
}
