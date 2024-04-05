import { getSdk } from "@generated/graphql"; // Adjust the import path according to where your generated code is
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(process.env.EXPO_PUBLIC_EAS_GRAPHQL);
export const sdk = getSdk(client);
