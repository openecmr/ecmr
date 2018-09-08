package org.ecmr.app.domain.contracts;

public class Contract {
    private ContractId contractId;
    private Issuer issuer;
    private TradeParty consignor;
    private TradeParty consignee;
    private TradeParty carrier;
    private Location despatchLocation;
    private Location deliveryLocation;
    private Consignment consignment;

    public Contract(ContractId contractId, Issuer issuer, TradeParty consignor, TradeParty consignee, TradeParty carrier, Location despatchLocation, Location deliveryLocation, Consignment consignment) {
        this.contractId = contractId;
        this.issuer = issuer;
        this.consignor = consignor;
        this.consignee = consignee;
        this.carrier = carrier;
        this.despatchLocation = despatchLocation;
        this.deliveryLocation = deliveryLocation;
        this.consignment = consignment;
    }

    public void setContractId(ContractId contractId) {
        this.contractId = contractId;
    }

    public TradeParty getConsignor() {
        return consignor;
    }

    public TradeParty getConsignee() {
        return consignee;
    }

    public TradeParty getCarrier() {
        return carrier;
    }

    public Location getDespatchLocation() {
        return despatchLocation;
    }

    public Location getDeliveryLocation() {
        return deliveryLocation;
    }

    public Consignment getConsignment() {
        return consignment;
    }

    public ContractId getContractId() {
        return contractId;
    }

    public Issuer getIssuer() {
        return issuer;
    }
}
