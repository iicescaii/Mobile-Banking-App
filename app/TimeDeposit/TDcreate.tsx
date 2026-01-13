import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateTimeDeposit = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [investmentDuration, setInvestmentDuration] = useState<number>(6);
  const [interest, setInterest] = useState<string>("0.00");

  const interestRates: Record<number, number> = {
    6: 6.0,
    9: 4.5,
    12: 4.75,
    18: 5.0,
    24: 5.25,
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        console.log("AsyncStorage user_id:", storedUserId);
        if (storedUserId) {
          setUserId(storedUserId);
          console.log("Parsed user_id:", storedUserId);
        } else {
          Alert.alert("Error", "User ID not found in AsyncStorage. Please login.");
        }
      } catch (error) {
        console.error("Error fetching user_id:", error);
        Alert.alert("Error", "Failed to retrieve user ID.");
      }
    };

    fetchUserId();
  }, []);

  const calculateInterest = (amount: string, months: number): string => {
    const numericAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return "0.00";
    }
    const rate = interestRates[months] || 0;
    const earnedInterest = (numericAmount * rate) / 100;
    return earnedInterest.toFixed(2);
  };

  const handleDurationChange = (duration: number) => {
    setInvestmentDuration(duration);
    setInterest(calculateInterest(investmentAmount, duration));
  };

  const handleInvestmentChange = (value: string) => {
    setInvestmentAmount(value);
    setInterest(calculateInterest(value, investmentDuration));
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered");

    if (!userId) {
      console.log("No userId found, exiting handleSubmit");
      Alert.alert("Error", "User ID not found. Please login again.");
      return;
    }
    console.log("userId exists:", userId);

    if (!investmentAmount) {
      console.log("No investmentAmount entered, exiting handleSubmit");
      Alert.alert("Error", "Please enter a valid investment amount.");
      return;
    }

    const numericInvestment = parseFloat(investmentAmount.replace(/,/g, ""));
    console.log("Parsed numericInvestment:", numericInvestment);

    if (isNaN(numericInvestment) || numericInvestment <= 0) {
      console.log("Invalid numericInvestment, exiting handleSubmit");
      Alert.alert("Error", "Please enter a valid investment amount.");
      return;
    }

    console.log("Passed validation, sending POST request...");

    try {
      const response = await axios.post("http://192.168.1.6:5000/api/time-deposits/create", {
        user_id: userId,
        investmentAmount: numericInvestment,
        investmentDuration,
        interest: parseFloat(interest),
        nickname: "", // empty now, nickname added later in TDnickname
      });

      console.log("POST response:", response);
      console.log("POST response status:", response.status);
      console.log("POST response data:", response.data);

      if (response.status === 201 && response.data.depositId) {
        console.log("depositId found, navigating to TDnickname...");

        await router.push({
          pathname: "./TDnickname",
          params: {
            investmentAmount,
            investmentDuration,
            interest,
            depositId: response.data.depositId,
          },
        });

        console.log("Navigation to TDnickname completed.");
      } else {
        Alert.alert("Error", "Failed to create time deposit - invalid response.");
      }
    } catch (error) {
      console.error("Error creating time deposit:", error);
      Alert.alert("Error", "Server error while creating time deposit.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("./myTD")}
      >
        <Ionicons name="arrow-back-circle" size={40} color="#9993CC" />
      </TouchableOpacity>

      <Text style={styles.title}>How much will you invest?</Text>

      <TextInput
        style={styles.amountInput}
        keyboardType="numeric"
        value={investmentAmount}
        onChangeText={handleInvestmentChange}
        placeholder="e.g ₱5,000"
        placeholderTextColor="#9993CC"
      />

      <Text style={styles.label}>How long will we grow your money?</Text>
      <View style={styles.durationContainer}>
        <View style={styles.buttonContainer}>
          {Object.keys(interestRates).map((duration) => (
            <TouchableOpacity
              key={duration}
              style={[
                styles.durationButton,
                investmentDuration === Number(duration) && styles.selectedButton,
              ]}
              onPress={() => handleDurationChange(Number(duration))}
            >
              <Text style={styles.durationText}>{duration} mos</Text>
              <Text style={styles.rateText}>{interestRates[Number(duration)]}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.interestAmount}>Interest: ₱{interest}</Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>I am interested</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F7F7F7" },
  backButton: { position: "absolute", top: 1, left: 1 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9993CC",
    marginTop: "20%",
    marginBottom: "10%",
    textAlign: "center",
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#9993CC",
    marginBottom: 10,
    textAlign: "center",
  },
  amountInput: {
    fontSize: 20,
    color: "#6B3E9C",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#6B3E9C",
  },
  durationContainer: { marginBottom: 30, paddingHorizontal: 10 },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  durationButton: {
    backgroundColor: "#9993CC",
    paddingVertical: 20,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "18%",
  },
  selectedButton: { backgroundColor: "#9B70D7" },
  durationText: {
    fontSize: 16,
    color: "#FFF",
    marginTop: "20%",
    marginBottom: "15%",
  },
  rateText: { fontSize: 12, color: "#FFF", fontWeight: "bold", marginBottom: "20%" },
  interestAmount: {
    fontSize: 30,
    color: "#9993CC",
    marginVertical: 10,
    textAlign: "center",
    marginTop: "10%",
  },
  submitButton: {
    backgroundColor: "#9993CC",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "30%",
  },
  submitButtonText: { color: "#FFF", fontSize: 15 },
});

export default CreateTimeDeposit;
