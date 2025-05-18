import { FontAwesome5, MaterialIcons } from "@expo/vector-icons"; // For icons
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { getAllUsers, saveNewUser, User } from "../services/userService"; // Corrected path

// Define available roles
const EMPLOYEE_ROLES = [
  { label: "Atendente", value: "atendente" },
  { label: "Cozinheiro", value: "cozinheiro" },
  { label: "Caixa", value: "caixa" },
  { label: "Gerente", value: "gerente" },
  { label: "Admin", value: "ADMIN" }, // Keep ADMIN role as per previous setup
];

export default function EmployeesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userRole?: string }>(); // Get userRole
  const currentUserRole = params.userRole;

  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [selectedRole, setSelectedRole] = useState(EMPLOYEE_ROLES[0].value);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState({ login: "", pin: "" });

  const fetchUsers = async () => {
    const fetchedUsers = await getAllUsers();
    setUsers(fetchedUsers);
  };

  // Fetch users when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const generateLogin = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    result += Math.floor(10 + Math.random() * 90); // 2 numbers
    return result;
  };

  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 numbers
  };

  const handleAddEmployee = async () => {
    if (!newUserName.trim()) {
      Alert.alert("Erro", "O nome do funcionário é obrigatório.");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(), // Simple unique ID
      name: newUserName.trim(),
      login: generateLogin(),
      pin: generatePin(),
      role: selectedRole,
    };

    const success = await saveNewUser(newUser);
    if (success) {
      setGeneratedCredentials({ login: newUser.login, pin: newUser.pin });
      setModalVisible(false);
      setSuccessModalVisible(true); // Open success modal
      setNewUserName("");
      setSelectedRole(EMPLOYEE_ROLES[0].value);
    } else {
      Alert.alert(
        "Erro",
        "Não foi possível adicionar o funcionário. O login gerado pode já existir ou ocorreu outro erro."
      );
    }
  };

  const closeSuccessModalAndRefresh = () => {
    setSuccessModalVisible(false);
    fetchUsers(); // Refresh list after closing success modal
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItemContainer}>
      <FontAwesome5 name="user-circle" size={36} color="#B0BEC5" style={styles.profileIcon} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userDetails}>Login: {item.login}</Text>
        {(currentUserRole === "ADMIN" || currentUserRole === "gerente") && (
          <Text style={styles.userDetails}>PIN: {item.pin}</Text>
        )}
        <Text style={styles.userDetails}>Cargo: {item.role}</Text>
      </View>
      {/* TODO: Add Edit/Delete buttons here */}
    </View>
  );

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <Text style={styles.emptyListText}>Nenhum funcionário cadastrado.</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
        />
      )}

      {/* Conditional FAB rendering */}
      {(currentUserRole === "ADMIN" || currentUserRole === "gerente") && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Add Employee Modal (Modified for Checkbox style role selection) */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar Novo Funcionário</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Funcionário"
            placeholderTextColor="#A0AEC0"
            value={newUserName}
            onChangeText={setNewUserName}
          />
          <Text style={styles.roleSelectionTitle}>Cargo:</Text>
          {EMPLOYEE_ROLES.map((role) => (
            <TouchableOpacity
              key={role.value}
              style={styles.checkboxContainer}
              onPress={() => setSelectedRole(role.value)}
            >
              <MaterialIcons
                name={selectedRole === role.value ? "check-box" : "check-box-outline-blank"}
                size={24}
                color="#23395D"
              />
              <Text style={styles.checkboxLabel}>{role.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addButtonModal} onPress={handleAddEmployee}>
            <Text style={styles.addButtonModalText}>Salvar Funcionário</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButtonModal} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonModalText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal isVisible={isSuccessModalVisible} onBackdropPress={closeSuccessModalAndRefresh} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Funcionário Criado!</Text>
          <Text style={styles.credentialsText}>Login: {generatedCredentials.login}</Text>
          <Text style={styles.credentialsText}>PIN: {generatedCredentials.pin}</Text>
          {/* TODO: Add copy to clipboard buttons */}
          <TouchableOpacity style={styles.okButtonModal} onPress={closeSuccessModalAndRefresh}>
            <Text style={styles.okButtonModalText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB", // Gelo
  },
  listContentContainer: {
    padding: 20,
    paddingBottom: 80, // Ensure space for FAB
  },
  userItemContainer: {
    flexDirection: "row", // Added to align icon and info horizontally
    alignItems: "center", // Center items vertically
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileIcon: {
    marginRight: 15, // Space between icon and user info
  },
  userInfo: {
    flex: 1, // Allow userInfo to take remaining space
  },
  userName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#23395D",
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#38434D",
    marginBottom: 2,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#38434D",
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#27AE60", // Verde para adicionar
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    elevation: 8, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { height: 2, width: 0 },
  },
  modal: {
    justifyContent: "center", // Center modal vertically
    margin: 0, // Remove default margins
    // alignItems: "center", // Optional: center horizontally if modalContent width is not 100%
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    marginHorizontal: 20, // Add some horizontal margin for the modal itself
    // width: "90%", // If you want to control width explicitly
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#23395D",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#23395D",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 15 : 12, // iOS needs a bit more padding for height
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#23395D",
    marginBottom: 15, // Adjusted margin
    minHeight: 50, // Ensure good height
  },
  roleSelectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#23395D",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 5, // Add some padding for better touch area
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#23395D",
  },
  addButtonModal: {
    backgroundColor: "#27AE60", // Verde
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10, // Added margin top
  },
  addButtonModalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  cancelButtonModal: {
    backgroundColor: "#E0E0E0", // Light gray for cancel
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonModalText: {
    color: "#38434D",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  credentialsText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#23395D",
    marginBottom: 10,
    textAlign: "center",
  },
  okButtonModal: {
    backgroundColor: "#23395D", // Azul Marinho for OK button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20, // Space above OK button
  },
  okButtonModalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
