import {SignUp} from "aws-amplify-react";
import {Auth} from "aws-amplify";
import {ConsoleLogger as Logger} from "@aws-amplify/core/lib-esm/Logger/ConsoleLogger";

const logger = new Logger('SignUp');
export default class SignUpWithLanguage extends SignUp {
    constructor(props) {
        super(props);
    }

    signUp() {
        this.setState({ requestPending: true });
        if (!this.inputs.dial_code) {
            this.inputs.dial_code = this.getDefaultDialCode();
        }
        const validation = this.validate();
        if (validation && validation.length > 0) {
            return this.error(
                `The following fields need to be filled out: ${validation.join(', ')}`
            );
        }
        if (!Auth || typeof Auth.signUp !== 'function') {
            throw new Error(
                'No Auth module found, please ensure @aws-amplify/auth is imported'
            );
        }

        const signup_info = {
            username: this.inputs.username,
            password: this.inputs.password,
            attributes: {},
            clientMetadata: {
                language: navigator.languages
                    ? navigator.languages[0]
                    : (navigator.language || navigator.userLanguage)
            }
        };

        const inputKeys = Object.keys(this.inputs);
        const inputVals = Object.values(this.inputs);

        inputKeys.forEach((key, index) => {
            if (
                !['username', 'password', 'checkedValue', 'dial_code'].includes(key)
            ) {
                if (
                    key !== 'phone_line_number' &&
                    key !== 'dial_code' &&
                    key !== 'error'
                ) {
                    const newKey = `${this.needPrefix(key) ? 'custom:' : ''}${key}`;
                    signup_info.attributes[newKey] = inputVals[index];
                }
            }
        });

        if (this.phone_number)
            signup_info.attributes['phone_number'] = this.phone_number;

        let labelCheck = false;
        this.signUpFields.forEach(field => {
            if (field.label === this.getUsernameLabel()) {
                logger.debug(`Changing the username to the value of ${field.label}`);
                signup_info.username =
                    signup_info.attributes[field.key] || signup_info.username;
                labelCheck = true;
            }
        });
        if (!labelCheck && !signup_info.username) {
            // if the customer customized the username field in the sign up form
            // He needs to either set the key of that field to 'username'
            // Or make the label of the field the same as the 'usernameAttributes'
            throw new Error(
                `Couldn't find the label: ${this.getUsernameLabel()}, in sign up fields according to usernameAttributes!`
            );
        }
        Auth.signUp(signup_info)
            .then(data => {
                this.setState({ requestPending: false });
                // @ts-ignore
                this.changeState('confirmSignUp', data.user.username);
            })
            .catch(err => {
                this.setState({ requestPending: false });
                return this.error(err);
            });
    }

    showComponent(theme) {
        this.props.hide.splice(this.props.hide.indexOf(SignUp), 1);
        return super.showComponent(theme);
    }
}