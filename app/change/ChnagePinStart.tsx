import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ChangePinStart = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change PIN</Text>

      <View style={styles.card}>
        <Text style={styles.label}>6-Digit PIN</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("./EnterOldPin")}
        >
          <Text style={styles.buttonText}>Change pin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#9993CC",
    color: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#f6f6f6",
    padding: 20,
    borderRadius: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  label: { fontSize: 16, fontWeight: "600" },
  button: {
    backgroundColor: "#9993CC",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", fontSize: 14 },
});

export default ChangePinStart;
