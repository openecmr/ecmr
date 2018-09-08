package org.ecmr.app.application.contracts.data;

import org.ecmr.app.domain.contracts.*;

public class ContractData {
    private ContractId contractId;
    private Issuer issuer;
    private TradeParty consignor;
    private TradeParty consignee;
    private TradeParty carrier;
    private Location despatchLocation;
    private Location deliveryLocation;
    private Consignment consignment;

    public ContractId getContractId() {
        return contractId;
    }

    public void setContractId(ContractId contractId) {
        this.contractId = contractId;
    }

    public Issuer getIssuer() {
        return issuer;
    }

    public void setIssuer(Issuer issuer) {
        this.issuer = issuer;
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
