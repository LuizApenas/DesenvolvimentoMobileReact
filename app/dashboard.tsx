// app/dashboard.tsx
// Font loading and SplashScreen are now handled by app/_layout.tsx
// import { Inter_400Regular, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { useLocalSearchParams, useRouter } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect } from "react";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// SplashScreen.preventAutoHideAsync(); // Handled in _layout.tsx

export default function DashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userName?: string; userRole?: string }>();

  // Font loading state is no longer managed here
  // let [fontsLoaded, fontError] = useFonts(...);

  // useEffect(() => { ... }); // Font and splash screen effect is no longer managed here

  // Font loading check is no longer needed here as _layout handles it
  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }

  const handleLogout = () => {
    // Implementation of handleLogout function
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* TODO: Add Fish Logo here if desired */}
      <Text style={styles.restaurantTitle}>Peixaria do Luiz</Text>
      <Text style={styles.greetingText}>Olá, {params.userName || "Usuário"}!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.mainButton, styles.navButton]}
          onPress={() => router.push({ pathname: "/employees", params: { userRole: params.userRole } })}
        >
          <Feather name="users" size={24} color="#23395D" style={styles.iconStyle} />
          <Text style={styles.buttonText}>Funcionários</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, styles.navButton]}
          onPress={() => router.push("/menu")} // Navigate to menu screen
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#23395D" style={styles.iconStyle} />
          <Text style={styles.buttonText}>Cardápio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, styles.navButton]}
          onPress={() => router.push("/orders")} // Navigate to orders screen
        >
          <Ionicons name="receipt-outline" size={24} color="#23395D" style={styles.iconStyle} />
          <Text style={styles.buttonText}>Pedidos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB", // Gelo
    alignItems: "center",
    paddingTop: 60, // More space at the top
    paddingHorizontal: 24,
  },
  restaurantTitle: {
    fontSize: 28,
    // fontFamily: "Inter_700Bold", // Font family will be inherited or set by specific components as needed
    color: "#23395D",
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 18,
    // fontFamily: "Inter_400Regular",
    color: "#23395D",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  mainButton: {
    flexDirection: "row", // For icon and text alignment
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20, // Space between buttons
    width: "90%", // Buttons take up most of the width
    minHeight: 60, // Ensure buttons have a good tap area
  },
  navButton: {
    backgroundColor: "#FFFFFF", // White background for nav buttons
    borderColor: "#23395D", // Azul marinho outline
    borderWidth: 1.5,
  },
  buttonText: {
    // fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#23395D",
    marginLeft: 15,
  },
  iconStyle: {
    // Minimal style for icons, can be expanded
  },
  // TODO: Add styles for action buttons (green for add, red for delete)
});
