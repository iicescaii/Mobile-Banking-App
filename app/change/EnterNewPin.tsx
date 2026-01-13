import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EnterNewPin = () => {
  const [pin, setPin] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  // Load user_id from AsyncStorage on mount (if needed elsewhere)
  React.useEffect(() => {
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

  const handleDigit = (digit: string) => {
    const updated = pin + digit;
    setPin(updated);

    if (updated.length === 6) {
      // No API call here — just navigate and pass PIN param
      router.push({
        pathname: "./PinUpdated",
        params: { pin: updated },
      });
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter new PIN</Text>
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
          >
            <Text style={styles.digitText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.digit} onPress={handleBackspace}>
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

export default EnterNewPin;
