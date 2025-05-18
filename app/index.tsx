import { useRouter } from "expo-router"; // Import useRouter for navigation
import { useEffect, useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FishLogo from "../assets/images/fish-logo.svg"; // Import the SVG logo
import { getUserByLoginAndPin, initializeDefaultAdmin } from "../services/userService"; // Import a função de inicialização

export default function Page() {
  const router = useRouter(); // Initialize router
  const [login, setLogin] = useState("");
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    async function prepareApp() {
      try {
        // Initialize default admin user
        await initializeDefaultAdmin();
      } catch (e) {
        console.warn("Error during app preparation:", e);
      }
    }

    prepareApp();
  }, []);

  const handleLogin = async () => {
    if (!login.trim() || !pin.trim()) {
      setLoginError("Usuário e PIN são obrigatórios.");
      return;
    }
    setLoginError(""); // Clear previous errors

    try {
      const user = await getUserByLoginAndPin(login, pin);
      if (user) {
        // Navigate to dashboard on successful login
        // Pass user's name to the dashboard screen
        // Use router.push to keep login screen in the navigation stack
        router.push({ pathname: "/dashboard", params: { userName: user.name } });
      } else {
        setLoginError("Login ou PIN inválido.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Ocorreu um erro ao tentar fazer login.");
      Alert.alert("Erro de Login", "Não foi possível conectar. Tente novamente mais tarde.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FishLogo width={100} height={100} fill="#23395D" style={styles.logo} />
      <Text style={styles.title}>Peixaria do Luiz</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Usuário (login)"
          placeholderTextColor="#A0AEC0"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />
        {/* Display error message for this input if loginError is for username specifically */}
        {/* For now, a general login error is shown below the button */}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="PIN"
          placeholderTextColor="#A0AEC0"
          secureTextEntry
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
        />
        {/* Display error message for this input if loginError is for PIN specifically */}
      </View>

      {loginError ? <Text style={styles.errorTextGlobal}>{loginError}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>Precisa cadastrar? Fale com o gerente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB", // Gelo
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "#23395D",
    marginBottom: 40,
  },
  inputContainer: {
    width: "80%", // Ensure inputs are not too wide
    marginBottom: 15, // Spacing between input fields
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#23395D",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#23395D",
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#27AE60", // Verde
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10, // Adjusted margin to make space for global error
    width: "80%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  registerText: {
    color: "#23395D",
    fontSize: 14,
    marginTop: 25,
  },
  errorTextGlobal: {
    fontSize: 14,
    color: "#E74C3C",
    marginBottom: 10, // Space before the login button
    textAlign: "center",
    width: "80%",
  },
});
