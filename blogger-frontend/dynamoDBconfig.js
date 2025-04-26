import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client=new DynamoDBClient({
    region:import.meta.env.VITE_REGION,
    credentials:{
        accessKeyId:import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey:import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
    }
})

export const docClient=DynamoDBDocumentClient.from(client)

// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import {
//   SecretsManagerClient,
//   GetSecretValueCommand,
// } from "@aws-sdk/client-secrets-manager";

// // Function to get secrets and create DynamoDB client
// async function createDynamoDBClient() {
//   const secret_name = "bloggerSecrets";
//   const client = new SecretsManagerClient({
//     region: "ap-south-1",
//   });

//   try {
//     const response = await client.send(
//       new GetSecretValueCommand({
//         SecretId: secret_name,
//         VersionStage: "AWSCURRENT",
//       })
//     );

//     const secrets = JSON.parse(response.SecretString);

//     const dynamoDBClient = new DynamoDBClient({
//       region: secrets.VITE_REGION,
//       credentials: {
//         accessKeyId: secrets.VITE_AWS_ACCESS_KEY_ID,
//         secretAccessKey: secrets.VITE_AWS_SECRET_ACCESS_KEY
//       }
//     });

//     return DynamoDBDocumentClient.from(dynamoDBClient);
//   } catch (error) {
//     console.error("Error retrieving DynamoDB client secrets:", error);
//     throw error;
//   }
// }

// // Export a function to get the client
// export const getDynamoDBDocClient = createDynamoDBClient;