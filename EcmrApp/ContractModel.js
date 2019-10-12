class ContractModel {
    constructor(contract) {
        Object.assign(this, contract);
    }

    total() {
        return this.loads.reduce((acc, load) => acc + (load.quantity ? load.quantity : 0), 0);
    }
}

export default ContractModel;