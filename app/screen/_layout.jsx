import { Stack } from "expo-router";

export default function ScrrenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { heigth: 0, width: 0 },
      }}
    >
      <Stack.Screen name="barcode" options={{ title: "Barcode" }} />
      <Stack.Screen name="upload" options={{ title: "Upload" }} />
      <Stack.Screen name="analysis" options={{ title: "Analysis" }} />
      <Stack.Screen name="category" options={{ title: "Category" }} />
      <Stack.Screen name="uploadAnalysis" options={{ title: "Analysis" }} />
    </Stack>
  );
}
