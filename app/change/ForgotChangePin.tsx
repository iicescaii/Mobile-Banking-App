import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForgotChangePin = () => {
  const router = useRouter();
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const stored = await AsyncStorage.getItem("user_data");
        const parsed = stored ? JSON.parse(stored) : null;
        const id = parsed?.user_id;
        if (!id) {
          Alert.alert("Error", "No user ID found");
        } else {
          setUserId(id);
        }
      } catch (error) {
        console.error("Error reading user data", error);
      }
    };
    getUserId();
  }, []);

  const handleUpdate = async () => {
    setError("");
    if (newPin.length !== 6 || confirmPin.length !== 6) {
      setError("PIN must be exactly 6 digits");
      return;
    }
    if (newPin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    if (!userId) {
      setError("User ID not found");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/verify/update-pin/${userId}`,
        { pin: newPin }
      );

      if (response.data.success) {
        Alert.alert("Success", "PIN updated successfully!");
        router.push("./ForgotPinUpdated");
      } else {
        setError(response.data.message || "Failed to update PIN");
      }
    } catch (error) {
      console.error("Update PIN error:", error);
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reset PIN</Text>

      <View style={styles.form}>
        <Text style={styles.label}>New 6-Digit PIN</Text>
        <TextInput
          style={styles.input}
          value={newPin}
          onChangeText={(text) => setNewPin(text.replace(/[^0-9]/g, ""))}
          maxLength={6}
          keyboardType="number-pad"
          secureTextEntry
          editable={!loading}
        />

        <Text style={styles.label}>Confirm New PIN</Text>
        <TextInput
          style={styles.input}
          value={confirmPin}
          onChangeText={(text) => setConfirmPin(text.replace(/[^0-9]/g, ""))}
          maxLength={6}
          keyboardType="number-pad"
          secureTextEntry
          editable={!loading}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Updating..." : "Update PIN"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonDisabled: {
    backgroundColor: "#999",
  },
  container: {
    backgroundColor: "#fff",
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#9993CC",
    color: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    textAlign: "center",
    marginBottom: 20,
  },
  form: { backgroundColor: "#f6f6f6", borderRadius: 10, padding: 20 },
  label: { fontSize: 14, marginBottom: 5, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#9993CC",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  error: { color: "red", marginTop: 10, textAlign: "center" },
});

export default ForgotChangePin;
