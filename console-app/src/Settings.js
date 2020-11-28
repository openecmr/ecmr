import {Grid, Header, Button, Form, Segment, Menu} from "semantic-ui-react";
import {API, graphqlOperation, I18n} from "aws-amplify";
import React, {useState} from "react";
import * as mutations from "./graphql/mutations";

export default function Settings({company, onCompanyUpdated}) {
    const [name, setName] = useState(company && company.name);
    const [loading, setLoading] = useState(false);
    if (!company) {
        return <div/>;
    }

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
                        <Form.Group>
                            <Form.Input value={name}
                                        label={I18n.get("Company name")}
                                        onChange={e => setName(e.target.value)} name="name" type={'text'}/>
                        </Form.Group>
                        <Button primary loading={loading} positive onClick={save}>{I18n.get('Save')}</Button>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>

    </div>;
}



