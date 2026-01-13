import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { saveToken } from "../utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForgotAuthentication: React.FC = () => {
  const router = useRouter();
  const { email, user_id: routeUserId } = useLocalSearchParams<{
    email: string;
    user_id?: string;
  }>();

  const [userId, setUserId] = useState<string>(routeUserId || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUserIdFromStorage = async () => {
      if (!userId) {
        const stored = await AsyncStorage.getItem("user_data");
        const parsed = stored ? JSON.parse(stored) : {};
        setUserId(parsed?.user_id);
      }
    };
    getUserIdFromStorage();
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    setMessage("");

    if (otp.some((digit) => digit === "")) {
      setError("Please complete all OTP fields");
      return;
    }

    const code = otp.join("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", {
        user_id: userId,
        otp: code,
      });

      const data = res.data;

      if (data.success) {
        if (data.token) {
          await saveToken(data.token);
        }

        setMessage("OTP Verified! Redirecting...");

        if (data.terms_accepted === 0) {
          router.push({ pathname: "./BeforeProceed", params: { email } });
        } else if (data.terms_accepted === 1 && !data.pin) {
          router.push({ pathname: "./PinSetup", params: { email } });
        } else {
          router.push({ pathname: "./ForgotChange", params: { email } });
        }
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Server error during OTP verification");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/send-otp", {
        user_id: userId,
        email,
      });

      if (res.data.success) {
        setMessage("OTP sent. Please check your email.");
      } else {
        setError(res.data.message || "Could not send OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Verify Your Identity</Text>
      <Text style={styles.description}>
        Enter the 6-digit OTP sent to your email address: {email}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            maxLength={1}
            keyboardType="numeric"
            editable={!loading}
          />
        ))}
      </View>

      {message ? <Text style={styles.messageText}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        onPress={handleResendOtp}
        style={styles.resendButton}
        disabled={loading}
      >
        <Text style={[styles.resendText, loading && { color: "#ccc" }]}>
          Resend OTP
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleVerify}
        style={[styles.verifyButton, loading && { backgroundColor: "#ccc" }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyText}>Verify</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    textAlign: "center",
    fontSize: 24,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  resendButton: {
    marginBottom: 20,
  },
  resendText: {
    color: "#9993CC",
    fontSize: 16,
  },
  verifyButton: {
    backgroundColor: "#9993CC",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
  },
  messageText: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ForgotAuthentication;
