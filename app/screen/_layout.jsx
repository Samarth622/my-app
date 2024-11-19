import { Stack } from "expo-router";

export default function ScrrenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { heigth: 0, width: 0 },
      }}
    >
      <Stack.Screen name="barcode" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="analysis" />
      <Stack.Screen name="category" />
      <Stack.Screen name="uploadAnalysis" />
    </Stack>
  );
}
