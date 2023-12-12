import { Stack } from "expo-router";

export default () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="companies"
    >
      <Stack.Screen name="companies" />
      <Stack.Screen name="attestations" />
    </Stack>
  );
};
