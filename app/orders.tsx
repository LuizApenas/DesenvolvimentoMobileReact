import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      <Text>Conteúdo da tela de pedidos aqui.</Text>
      <Link href="/dashboard" style={styles.link}>
        Voltar para Dashboard
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F6F8FB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#23395D",
    marginBottom: 20,
  },
  link: {
    marginTop: 20,
    color: "#23395D",
    textDecorationLine: "underline",
  },
});
