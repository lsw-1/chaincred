declare namespace NodeJS {
  export interface ProcessEnv {
    EXPO_PUBLIC_TW_CLIENT_ID: string;
    EXPO_PUBLIC_EAS_CONTRACT: string;
    EXPO_PUBLIC_SCHEMA_ADRESS_ACTION: string;
    EXPO_PUBLIC_SCHEMA_ADRESS_REVIEW: string;
    EXPO_PUBLIC_EAS_SCHEMA_REGISTRY: string;
    EXPO_PUBLIC_EAS_GRAPHQL: string;
    EXPO_PUBLIC_API_KEY_GOOGLE: string;
    EXPO_PUBLIC_ORGANIZATION_MANAGER_ADDRESS: string;
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_THIRDWEB_AUTH_PRIVATE_KEY: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    EXPO_PUBLIC_SERVER_URL: string;
  }
}

declare module "@env" {
  export const EXPO_PUBLIC_TW_CLIENT_ID: string;
  export const EXPO_PUBLIC_EAS_CONTRACT: string;
  export const EXPO_PUBLIC_SCHEMA_ADRESS_ACTION: string;
  export const EXPO_PUBLIC_SCHEMA_ADRESS_REVIEW: string;
  export const EXPO_PUBLIC_EAS_SCHEMA_REGISTRY: string;
  export const EXPO_PUBLIC_EAS_GRAPHQL: string;
  export const EXPO_PUBLIC_API_KEY_GOOGLE: string;
  export const EXPO_PUBLIC_ORGANIZATION_MANAGER_ADDRESS: string;
  export const EXPO_PUBLIC_SUPABASE_URL: string;
  export const EXPO_PUBLIC_THIRDWEB_AUTH_PRIVATE_KEY: string;
  export const EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  export const EXPO_PUBLIC_SERVER_URL: string;
}
