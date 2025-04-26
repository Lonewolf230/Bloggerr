import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: import.meta.env.VITE_REGION });

async function getUserCreationDate(username) {
    try {
        const command = new AdminGetUserCommand({
            UserPoolId: import.meta.env.VITE_COGNITO_POOL_ID,
            Username: username
        });

        const response = await client.send(command);
        console.log("User Created On:", response.UserCreateDate);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

export {getUserCreationDate}