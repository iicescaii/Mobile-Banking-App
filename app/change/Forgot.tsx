import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Forgot = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    try {
      // Get user_id from AsyncStorage
      const stored = await AsyncStorage.getItem("user_data");
      const parsed = stored ? JSON.parse(stored) : null;
      const user_id = parsed?.user_id;
      if (!user_id) {
        setError("User not logged in or user_id not found");
        setLoading(false);
        return;
      }

      // Call your backend API with user_id and email
      const response = await axios.post(`http://localhost:5000/api/send-otp`, {
        user_id,
        email,
      });

      if (response.data.success) {
        setMessage("OTP sent! Please check your email.");

        // Navigate to OTP verification screen, passing email as param
        router.push({
          pathname: "./ForgotAuthentication",
          params: { email },
        });
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network or server error");
      console.error("Send OTP error:", err);
    }

    setLoading(false);
  };

  return (
    <View>
      {/* Your header and layout components */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.close}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Forgot your username or password?</Text>
        <Text style={styles.description}>
          Enter your email below. We will send an OTP to your registered email
          to verify your identity.
        </Text>

        <Text style={styles.inputLabel}>Email:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {message ? (
          <Text style={{ color: "green", marginBottom: 10 }}>{message}</Text>
        ) : null}
        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.confirmButton, loading && { backgroundColor: "#ccc" }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20,
  },
  back: {
    fontSize: 28,
    color: "#9993CC",
  },
  close: {
    fontSize: 28,
    color: "#9993CC",
  },
  container: {
    paddingHorizontal: 25,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    color: "#8681B6",
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    backgroundColor: "#FEFEFE",
    borderRadius: 8,
    width: "100%",
    height: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: "#8681B6",
    borderRadius: 8,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  confirmText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default Forgot;
