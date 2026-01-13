import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Import the Feather icon set
import axios from "axios";

const CreateAcc: React.FC = () => {
  const router = useRouter();
  const { accountNumber } = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialCharacter: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Track password visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false); // Track confirm password visibility

  useEffect(() => {
    const isUsernameValid =
      username.length >= 7 &&
      username.length <= 15 &&
      /^[A-Za-z0-9]/.test(username);
    const isPasswordValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])[A-Za-z\d@$!%*?&_-]{8,}$/.test(
        password
      );
    const isConfirmPasswordValid = password === confirmPassword;

    setPasswordValidations({
      minLength: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialCharacter: /[-!@#$%^&*(),.?_":{}|<>]/.test(password),
    });

    setIsSubmitEnabled(
      isUsernameValid && isPasswordValid && isConfirmPasswordValid
    );
  }, [username, password, confirmPassword]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = async () => {
    if (!isSubmitEnabled) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          username,
          password,
        }
      );

      // No need for response.ok here
      console.log("User created:", response.data);
      Alert.alert("Success", "Account created!");
      router.push("./EnterAccountDetails");
    } catch (error: any) {
      console.error(
        "❌ Registration error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to register"
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.headerTitle}>Create login details</Text>
      <View style={{ width: 24 }} />
      <Text style={styles.label}>Username</Text>
      <View>
        <TextInput
          style={(styles.input, styles.inputWrapper)}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <Text style={styles.hint}>
        Must be 7 - 15 characters beginning with letter or numbers.
      </Text>

      <View style={styles.eye}>
        <Text style={styles.label}>Password</Text>{" "}
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={20}
            color="#8681B6"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={(styles.input, styles.inputWrapper)}
          placeholder="Enter your password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.validationBox}>
        <Text
          style={[
            styles.validationText,
            { opacity: passwordValidations.minLength ? 1 : 0.5 },
          ]}
        >
          Must have at least 8 characters
        </Text>
        <Text
          style={[
            styles.validationText,
            { opacity: passwordValidations.lowercase ? 1 : 0.5 },
          ]}
        >
          Must contain a lowercase letter
        </Text>
        <Text
          style={[
            styles.validationText,
            { opacity: passwordValidations.uppercase ? 1 : 0.5 },
          ]}
        >
          Must contain an uppercase letter
        </Text>
        <Text
          style={[
            styles.validationText,
            { opacity: passwordValidations.number ? 1 : 0.5 },
          ]}
        >
          Must contain a number
        </Text>
        <Text
          style={[
            styles.validationText,
            { opacity: passwordValidations.specialCharacter ? 1 : 0.5 },
          ]}
        >
          Must contain a special character (except /*)
        </Text>
      </View>

      <View style={styles.eye}>
        <Text style={styles.label}>Confirm password</Text>
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
          <Icon
            name={isConfirmPasswordVisible ? "eye" : "eye-off"}
            size={20}
            color="#8681B6"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={(styles.input, styles.inputWrapper)}
          placeholder="Re-enter your password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity
        style={[styles.submitButton, { opacity: isSubmitEnabled ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!isSubmitEnabled}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  eye: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backText: {
    fontSize: 28,
    color: "#9993CC",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8681B6",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    height: 45,
    paddingLeft: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#9993CC",
    marginTop: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  hint: {
    fontSize: 13,
    color: "#9993CC",
    marginTop: 5,
  },
  validationBox: {
    backgroundColor: "#F4F4F4",
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  validationText: {
    fontSize: 13,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#9993CC",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },
  submitText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CreateAcc;
