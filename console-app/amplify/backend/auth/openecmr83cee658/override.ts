import { AmplifyAuthCognitoStackTemplate, AmplifyProjectInfo } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate, amplifyProjectInfo: AmplifyProjectInfo) {
    const languageAttribute = {
        attributeDataType: "String",
        mutable: true,
        name: "custom:language"
    };
    const customLanguageAttribute = {
        attributeDataType: "String",
        mutable: true,
        name: "language"
    };

    resources.userPool.schema = [
        ...(resources.userPool.schema as any[]),
        languageAttribute,
        customLanguageAttribute
    ];
}
