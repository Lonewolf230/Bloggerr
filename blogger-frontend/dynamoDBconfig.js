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

