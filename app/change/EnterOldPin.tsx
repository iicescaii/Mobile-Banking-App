import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EnterOldPin = () => {
  const [pin, setPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleDigit = async (digit: string) => {
    if (loading) return; // ignore input while loading

    const updated = pin + digit;
    setPin(updated);

    if (updated.length === 6) {
      try {
        setLoading(true);
        const userData = await AsyncStorage.getItem("user_data");
        const parsed = userData ? JSON.parse(userData) : null;
        const user_id = parsed?.user_id;
        console.log("retrieved data:", user_id, "PIN:", { pin: updated });

        if (!user_id) {
          alert("❌ No user ID found in session.");
          setPin("");
          setLoading(false);
          return;
        }

        // Replace localhost with your machine IP if needed
        const response = await axios.post(
          `http://localhost:5000/api/verify/${user_id}`,
          { pin: updated }
        );

        if (!response.data.success) {
          Alert.alert("Error", "PIN is incorrect");
          setPin("");
          setLoading(false);
          return;
        }

        setPin("");
        setLoading(false);
        router.push({ pathname: "./EnterNewPin" });
      } catch (error) {
        console.error("PIN verification error:", error);
        Alert.alert("Error", "Failed to verify PIN.");
        setPin("");
        setLoading(false);
      }
    }
  };

  const handleBackspace = () => {
    if (loading) return;
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter current PIN</Text>
      <Text style={styles.subtext}>
        Please enter the 6-digit PIN used to log in to your app
      </Text>

      <View style={styles.pinRow}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.pinBox}>
            <Text style={styles.pinDot}>{pin[i] ? "•" : ""}</Text>
          </View>
        ))}
      </View>

      <View style={styles.numpad}>
        {[..."1234567890"].map((n) => (
          <TouchableOpacity
            key={n}
            style={styles.digit}
            onPress={() => handleDigit(n)}
            disabled={loading}
          >
            <Text style={styles.digitText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.digit}
          onPress={handleBackspace}
          disabled={loading}
        >
          <Text style={styles.digitText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: { fontSize: 20, fontWeight: "bold", marginTop: 20 },
  subtext: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#555",
  },
  pinRow: { flexDirection: "row", marginVertical: 20 },
  pinBox: {
    width: 40,
    height: 50,
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  pinDot: { fontSize: 24 },
  numpad: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  digit: {
    width: 70,
    height: 70,
    margin: 10,
    backgroundColor: "#eee",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  digitText: { fontSize: 22 },
});

export default EnterOldPin;
