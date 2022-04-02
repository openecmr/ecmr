import React, {useState} from "react";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {SelectList} from "./Components";
import * as queries from "./graphql/queries";
import * as customQueries from "./graphql/custom-queries"

const {useEffect} = require("react");

function SelectCompany({navigation: {navigate}}) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function () {
            const user = (await Auth.currentAuthenticatedUser());
            const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
            if (!groups) {
                return;
            }

            const companies = await Promise.all(
                groups
                    .filter(group => !group.endsWith("_Google"))
                    .map(async group => {
                        const companyResponse = await API.graphql(graphqlOperation(customQueries.companyByOwner, {owner: group}));
                        return companyResponse.data.companyByOwner.items[0];
                    }));

            setCompanies(companies);
            setLoading(false);
        })();
    }, []);

    function onSelect(company) {
        navigate('AddTransportScreen', {
            company: company.item
        });
    }

    return (
        <SelectList emptyLabel={I18n.get("You are not connected to any company. If you want to create a company please login to the Open e-CMR portal: https://app.openecmr.com/")}
                    renderSubtitle={(item) => ""}
                    loading={loading}
                    renderTitle={(item) => item.item.name}
                    data={companies}
                    style={{marginTop: 5, marginBottom: 70}}
                    onSelect={onSelect}
        />
    )
}

export default SelectCompany;