import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const ChangeUsername: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [currentUsernameInput, setCurrentUsernameInput] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch userId once on mount from AsyncStorage
  React.useEffect(() => {
    const getUserId = async () => {
      try {
        const stored = await AsyncStorage.getItem("user_data");
        console.log("Stored user_data:", stored);
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
    if (!currentUsernameInput || !newUsername || !confirmUsername) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newUsername !== confirmUsername) {
      Alert.alert("Error", "New usernames do not match");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID missing");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify current username matches database
      const verifyRes = await axios.get(
        `http://localhost:5000/api/user/${userId}`
      );

      if (verifyRes.data.username !== currentUsernameInput) {
        Alert.alert("Error", "Current username does not match our records");
        setLoading(false);
        return;
      }

      // Step 2: Update username if verification passed
      const updateRes = await axios.post(
        "http://localhost:5000/api/user/update-username",
        {
          user_id: userId,
          new_username: newUsername,
        }
      );

      if (updateRes.data.success) {
        Alert.alert("Success", "Username updated");
        router.push("./UsernameUpdated");
      } else {
        Alert.alert(
          "Error",
          updateRes.data.message || "Failed to update username"
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Server error updating username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Change Username</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Current Username</Text>
        <TextInput
          style={styles.input}
          value={currentUsernameInput}
          onChangeText={setCurrentUsernameInput}
          autoCapitalize="none"
          editable={!loading}
        />

        <Text style={styles.label}>Enter New Username</Text>
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
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#ccc" }]}
        onPress={handleUpdate}
        disabled={loading}
      >
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

export default ChangeUsername;
