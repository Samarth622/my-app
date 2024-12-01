import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

const AuthLayout =  () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true
        }}
      >
        <Stack.Screen name="sign-up" options={{ title: "Register" }} />
        <Stack.Screen name="sign-in" options={{ title: "Login" }} />
        <Stack.Screen name="forgot-password" />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
