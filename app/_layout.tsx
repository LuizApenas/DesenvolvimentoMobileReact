import { Inter_400Regular, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Render nothing until the fonts are loaded or an error occurs.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Painel Principal", // You can customize the title
          headerStyle: { backgroundColor: "#F6F8FB" }, // Gelo background
          headerTintColor: "#23395D", // Azul marinho for title and back button
          headerTitleStyle: {
            fontFamily: "Inter_700Bold", // Use Inter Bold for header title
          },
          // headerBackTitleVisible: false, // Optional: hide back button title on iOS
        }}
      />
      <Stack.Screen
        name="employees"
        options={{
          title: "Funcionários",
          headerStyle: { backgroundColor: "#F6F8FB" },
          headerTintColor: "#23395D",
          headerTitleStyle: {
            fontFamily: "Inter_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          title: "Cardápio",
          headerStyle: { backgroundColor: "#F6F8FB" },
          headerTintColor: "#23395D",
          headerTitleStyle: {
            fontFamily: "Inter_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: "Pedidos",
          headerStyle: { backgroundColor: "#F6F8FB" },
          headerTintColor: "#23395D",
          headerTitleStyle: {
            fontFamily: "Inter_700Bold",
          },
        }}
      />
    </Stack>
  );
}
