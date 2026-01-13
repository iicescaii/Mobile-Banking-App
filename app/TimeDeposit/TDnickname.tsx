import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const TDnickname: React.FC = () => {
  const [nickname, setNickname] = useState<string>("");
  const router = useRouter();

  const {
    investmentAmount,
    investmentDuration,
    interest,
    depositId,
  } = useLocalSearchParams();

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert("Please enter a nickname!");
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.1.6:5000/api/time-deposits/${depositId}/nickname`,
        { nickname: nickname.trim() }
      );

      if (response.status === 200) {
        router.push({
          pathname: "./TDsetup",
          params: {
            investmentAmount,
            investmentDuration,
            interest,
            nickname: nickname.trim(),
            depositId,
          },
        });
      } else {
        alert("Failed to update nickname.");
      }
    } catch (error) {
      console.error("Failed to update nickname:", error);
      alert("Error updating nickname. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("./TDcreate")}
      >
        <Ionicons name="arrow-back-circle" size={40} color="#8681B6" />
      </TouchableOpacity>

      <Text style={styles.title}>Give your Time Deposit a nickname</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#B0B0B0"
          value={nickname}
          onChangeText={setNickname}
          placeholder="e.g., Vacation Fund"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7", padding: 20 },
  backButton: { paddingVertical: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8681B6",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 30,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#B0B0B0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: "#333",
    borderWidth: 0,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#8681B6",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default TDnickname;
