import {Component} from "react";

export default class SortableTable extends Component {
    constructor(props, localStoragePrefix, defaultSort) {
        super(props);

        this.state = {
            loading: true,
            previousTokens: [],
            nextToken: null,
            sort: localStorage.getItem(localStoragePrefix + "Sort") || defaultSort,
            sortOrder: localStorage.getItem(localStoragePrefix + "SortOrder") || "descending"
        }

        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.refresh = this.refresh.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.onFirst = this.onFirst.bind(this);
        this.localStoragePrefix = localStoragePrefix
    }

    componentDidMount() {
        this.retrieveAppSync(this.state.currentPageToken);
    }

    applyFilters() {
        this.retrieveAppSync();
    }

    onNext() {
        if (this.state.currentPageToken) {
            const previousTokens = [...this.state.previousTokens];
            previousTokens.push(this.state.currentPageToken);
            this.setState({
                previousTokens
            });
        }
        this.setState({
            currentPageToken: this.state.nextToken
        });

        this.retrieveAppSync(this.state.nextToken)
    }

    refresh() {
        this.retrieveAppSync(this.state.currentPageToken);
    }

    onPrev() {
        const {previousTokens} = this.state;
        const previousToken = previousTokens[previousTokens.length - 1];
        this.setState({
            previousTokens: previousTokens.slice(0, previousTokens.length - 1),
            currentPageToken: previousToken
        });
        this.retrieveAppSync(previousToken);
    }

    onFirst() {
        this.setState({
            previousTokens: [],
            currentPageToken: null
        });
        this.retrieveAppSync();
    }

    changeSort(newSort) {
        const {sort} = this.state;

        let sortOrder;
        if (newSort === sort) {
            sortOrder = this.state.sortOrder === 'ascending' ? 'descending' : 'ascending'
        } else {
            sortOrder = 'descending';
        }
        localStorage.setItem(this.localStoragePrefix + 'SortOrder', sortOrder);
        localStorage.setItem(this.localStoragePrefix + 'Sort', newSort);
        this.setState({
            sortOrder,
            sort: newSort,
            previousTokens: [],
            nextToken: null,
            currentPageToken: null
        }, () => {
            this.retrieveAppSync()
        });
    }
}