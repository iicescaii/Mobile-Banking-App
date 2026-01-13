import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import CountryFlag from "react-native-country-flag";
import { useRouter } from "expo-router";
import axios from "axios";

const AccountDetailsForm: React.FC = () => {
  const router = useRouter();

  const [accountNumber, setAccountNumber] = useState("");
  const [dob, setDob] = useState({ month: "", day: "", year: "" });
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [termsPrivacy, setTermsPrivacy] = useState({
    terms: false,
    privacy: false,
  });

  // ✅ Validate if the form is completely filled
  const isFormValid =
    (accountNumber.length === 12 || accountNumber.length === 16) &&
    dob.month.length === 2 &&
    dob.day.length === 2 &&
    dob.year.length === 4 &&
    email.includes("@") &&
    mobile.length >= 10 &&
    termsPrivacy.terms &&
    termsPrivacy.privacy;

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Incomplete", "Please fill out all fields correctly.");
      return;
    }
    const formattedDob = `${dob.year}-${dob.month}-${dob.day}`;
    const agree = termsPrivacy.terms && termsPrivacy.privacy;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/accounts/details",
        {
          accountNumber,
          dob: formattedDob,
          email,
          mobile,
          agree,
        }
      );

      const data = response.data; // Axios parses JSON automatically

      if (data.success) {
        // ✅ Account verified
        router.push({ pathname: "./SignupSuccess", params: { accountNumber } });
      } else {
        Alert.alert(
          "Verification Failed",
          data.message || "Invalid account details"
        );
      }
    } catch (error: any) {
      console.error(
        "Error verifying account:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to connect to the server"
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back Arrow Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Enter your account details</Text>

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Account Number (12 or 16 digits)"
        placeholderTextColor="#999"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        maxLength={16}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.dobContainer}>
        <TextInput
          style={styles.dobInput}
          placeholder="MM"
          placeholderTextColor="#999"
          maxLength={2}
          value={dob.month}
          keyboardType="numeric"
          onChangeText={(text) => setDob({ ...dob, month: text })}
        />
        <TextInput
          style={styles.dobInput}
          placeholder="DD"
          placeholderTextColor="#999"
          maxLength={2}
          value={dob.day}
          keyboardType="numeric"
          onChangeText={(text) => setDob({ ...dob, day: text })}
        />
        <TextInput
          style={styles.dobInput}
          placeholder="YYYY"
          placeholderTextColor="#999"
          maxLength={4}
          value={dob.year}
          keyboardType="numeric"
          onChangeText={(text) => setDob({ ...dob, year: text })}
        />
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email linked to ZenBank account"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mobile Number</Text>
      <View style={styles.number}>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 8,
            },
            styles.input,
          ]}
        >
          <Text style={{ marginRight: 5 }}>(63+)</Text>
          <CountryFlag
            isoCode="PH"
            size={16}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 4, // Rounded corners for the flag
            }}
          />
        </View>

        <TextInput
          style={[styles.input, styles.number1]}
          placeholder="Mobile number (63XXXXXXXXXX)"
          placeholderTextColor="#999"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>

      {/* Checkboxes */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={termsPrivacy.terms}
          onValueChange={(value) =>
            setTermsPrivacy((prev) => ({ ...prev, terms: value }))
          }
          color={termsPrivacy.terms ? "#4CAF50" : undefined}
          style={styles.checkboxBox}
        />
        <Text style={styles.checkboxLabel}>
          I agree to the <Text style={styles.link}>Terms & Conditions</Text>
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={termsPrivacy.privacy}
          onValueChange={(value) =>
            setTermsPrivacy((prev) => ({ ...prev, privacy: value }))
          }
          color={termsPrivacy.privacy ? "#4CAF50" : undefined}
          style={styles.checkboxBox}
        />
        <Text style={styles.checkboxLabel}>
          I agree to the <Text style={styles.link}>Data Privacy Consent</Text>
        </Text>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: isFormValid ? "#9993CC" : "#D1CDEB" },
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  number1: {
    flex: 1,
    marginLeft: 10,
  },
  number: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 28,
    color: "#9993CC",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8681B6",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderColor: "#9993CC",
    borderWidth: 1,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  dobContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dobInput: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    borderColor: "#9993CC",
    borderWidth: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxBox: {
    marginRight: 10,
    width: 20,
    height: 20,
    borderRadius: 4,
    borderColor: "#999",
    borderWidth: 1.5,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
  link: {
    color: "#9993CC",
    textDecorationLine: "underline",
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AccountDetailsForm;
