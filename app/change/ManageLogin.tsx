import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ManageLogin: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("juandelacruz");
  const [password, setPassword] = useState("************");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Manage Login</Text>

      {/* Change PIN */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("./ChnagePinStart")}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="keypad-outline" size={28} color="#9993CC" />
        </View>
        <View>
          <Text style={styles.cardTitle}>Change PIN</Text>
          <Text style={styles.cardSubtitle}>Change your 6-digit PIN</Text>
        </View>
      </TouchableOpacity>

      {/* Username */}
      <Text style={styles.label}>Username</Text>
      <TouchableOpacity
        style={styles.inputRow}
        onPress={() => router.push("./ChangeUsername")}
      >
        <TextInput style={styles.input} value={username} editable={false} />
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TouchableOpacity
        style={styles.inputRow}
        onPress={() => router.push("./ChangePassword")}
      >
        <TextInput
          style={styles.input}
          value={password}
          secureTextEntry
          editable={false}
        />
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Support Note */}
      <Text style={styles.note}>
        If user login information are not updated, call ZenBank Contact Center
        (+632) 8912-9000 for assistance
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#fff",
    backgroundColor: "#9993CC",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  iconContainer: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 45,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  note: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 30,
  },
});

export default ManageLogin;
