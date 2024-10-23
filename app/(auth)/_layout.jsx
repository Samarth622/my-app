import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

const AuthLayout =  () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { heigth: 0, width: 0 },
        }}
      >
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="forgot-password" />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
