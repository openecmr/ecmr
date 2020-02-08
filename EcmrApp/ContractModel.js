class ContractModel {
    constructor(contract) {
        Object.assign(this, contract);
    }

    total() {
        return this.loads.reduce((acc, load) => acc + (load.quantity ? load.quantity : 0), 0);
    }

    siteDone(site) {
        return this.events.some(e => e.site === site && (e.type === 'LoadingComplete' || e.type === 'UnloadingComplete'));
    }

    activeSite() {
        const sites = ['pickup', 'delivery'];
        return sites.find(site => !this.siteDone(site));
    }
}

export default ContractModel;