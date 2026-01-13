import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const PinUpdated = () => {
  const router = useRouter();
  const { pin } = useLocalSearchParams<{ pin: string }>(); // get pin from params
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

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/verify/update-pin/${userId}`,
        { pin }
      );

      if (response.data.success) {
        Alert.alert("Success", "PIN updated successfully!");
        router.push("./ManageLogin");
      } else {
        Alert.alert("Error", response.data.message || "Failed to update PIN.");
      }
    } catch (error) {
      console.error("Error updating PIN:", error);
      Alert.alert("Error", "Server error while updating PIN.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Ionicons name="checkmark-circle" size={100} color="green" />
      <Text style={{ fontSize: 24, marginVertical: 10 }}>Well done!</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        You have successfully changed your 6-digit PIN
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 20 },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginVertical: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#9993CC",
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default PinUpdated;
