import {Grid, Header, Button, Form, Segment, Menu} from "semantic-ui-react";
import {API, graphqlOperation, I18n} from "aws-amplify";
import React, {useState} from "react";
import * as mutations from "./graphql/mutations";

export default function Settings({company, onCompanyUpdated, customerPortal}) {
    const [name, setName] = useState(company && company.name);
    const [loading, setLoading] = useState(false);
    if (!company) {
        return <div/>;
    }

    const protocol = window.location.protocol;
    const domain = window.location.host;
    const params = new URLSearchParams();
    params.append("carrierName", company.name);
    params.append("carrierOwner", company.owner);
    params.append("companyId", company.id);

    const link = `${protocol}//${domain}/portal?${params.toString()}`;

    async function save() {
        setLoading(true);
        await API.graphql(graphqlOperation(mutations.updateCompany, {
            input: {
                id: company.id,
                name: name
            }
        }));
        onCompanyUpdated();
        setLoading(false);
    }

    return <div>
        <Header as={'h2'}>{I18n.get("Settings")}</Header>
        <Grid stretched>
            <Grid.Column width={4}>
                <Menu fluid vertical tabular>
                    <Menu.Item
                        name={I18n.get('Company')}
                        active
                    />
                </Menu>
            </Grid.Column>

            <Grid.Column width={12}>
                <Segment>
                    <Form>
                            <Form.Input value={name}
                                        label={I18n.get("Company name")}
                                        onChange={e => setName(e.target.value)} name="name" type={'text'}/>
                        {!customerPortal && <div style={{paddingBottom: "20px"}}>
                                <Form.Field label={I18n.get("Customer portal link")}/>
                                <div style={{fontStyle: "italic", paddingBottom: "10px"}}>{I18n.get("Send this link to your customers to allow them to enter new transport orders. New orders can be found in the received orders section.")}</div>
                                <div style={{fontFamily: "monospace"}}>{link}</div>
                            </div>}
                        <Button primary loading={loading} positive onClick={save}>{I18n.get('Save')}</Button>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>

    </div>;
}



