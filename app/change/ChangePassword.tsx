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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const stored = await AsyncStorage.getItem("user_data");
        const parsed = stored ? JSON.parse(stored) : null;
        const id = parsed?.user_id;
        console.log("retrieved data: ", id);
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
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID missing");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify current password matches database
      const verifyRes = await axios.post(
        `http://localhost:5000/api/user/verify-password/${userId}`,
        {
          current_password: currentPassword,
        }
      );

      if (!verifyRes.data.success) {
        Alert.alert("Error", "Current password is incorrect");
        setLoading(false);
        return;
      }

      // Step 2: Update password if verification passed
      const updateRes = await axios.post(
        "http://localhost:5000/api/user/update-password",
        {
          user_id: userId,
          new_password: newPassword,
        }
      );

      if (updateRes.data.success) {
        Alert.alert("Success", "Password updated");
        router.push("./PasswordUpdated");
      } else {
        Alert.alert(
          "Error",
          updateRes.data.message || "Failed to update password"
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Server error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Change Password</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Enter Current Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <Text style={styles.label}>Enter New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Update"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  form: {
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
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
  },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default ChangePassword;
