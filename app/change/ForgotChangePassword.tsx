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

const ForgotChangePassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const stored = await AsyncStorage.getItem("user_data");
        if (!stored) throw new Error("No user data found");

        const parsed = JSON.parse(stored);
        if (!parsed?.user_id) throw new Error("User ID missing");

        setUserId(parsed.user_id);
        console.log(userId);
      } catch (err) {
        console.error("Error reading user data:", err);
        Alert.alert(
          "Error",
          "Failed to retrieve user data. Please login again."
        );
      }
    };
    getUserId();
  }, []);

  const handleUpdate = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/update-password",
        {
          user_id: userId,
          new_password: newPassword,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Password updated successfully.");
        router.push("./PasswordUpdated");
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to update password."
        );
      }
    } catch (error) {
      console.error("Network or server error:", error);
      setError("Network or server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Reset Password</Text>

      <View style={styles.form}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          editable={!loading}
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          editable={!loading}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Updating..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonDisabled: {
    backgroundColor: "#9e9e9e",
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

export default ForgotChangePassword;
