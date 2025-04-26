import { S3Client } from "@aws-sdk/client-s3"

    const s3Client= new S3Client({
        region:import.meta.env.VITE_REGION,
        credentials:{
            accessKeyId:import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey:import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        }
    })


export {s3Client}

// import { S3Client } from "@aws-sdk/client-s3";
// import {
//   SecretsManagerClient,
//   GetSecretValueCommand,
// } from "@aws-sdk/client-secrets-manager";

// // Function to get secrets and create S3 client
// async function createS3Client() {
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

//     return new S3Client({
//       region: secrets.VITE_REGION,
//       credentials: {
//         accessKeyId: secrets.VITE_AWS_ACCESS_KEY_ID,
//         secretAccessKey: secrets.VITE_AWS_SECRET_ACCESS_KEY
//       }
//     });
//   } catch (error) {
//     console.error("Error retrieving S3 client secrets:", error);
//     throw error;
//   }
// }

// // Export a function instead of a direct client
// export const getS3Client = createS3Client;