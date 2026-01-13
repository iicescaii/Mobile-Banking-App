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

const ForgotChangeUsername = () => {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      } catch (err) {
        console.error("Error reading user data", err);
      }
    };
    getUserId();
  }, []);

  const handleUpdate = async () => {
    setError("");

    if (!newUsername || !confirmUsername) {
      setError("Please fill all fields");
      return;
    }
    if (newUsername !== confirmUsername) {
      setError("Usernames do not match");
      return;
    }
    if (!userId) {
      setError("User ID not found");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/update-username",
        {
          user_id: userId,
          new_username: newUsername,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Username updated successfully!");
        router.push("./ForgotUsernameUpdated");
      } else {
        setError(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update username error:", err);
      setError("Network/server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reset Username</Text>

      <View style={styles.form}>
        <Text style={styles.label}>New Username</Text>
        <TextInput
          style={styles.input}
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        <Text style={styles.label}>Confirm New Username</Text>
        <TextInput
          style={styles.input}
          value={confirmUsername}
          onChangeText={setConfirmUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Updating..." : "Update"}
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

export default ForgotChangeUsername;
