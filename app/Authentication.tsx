import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message'; // ✅ toast import
import { saveToken } from '../utils/tokenStorage';

const Authentication: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const router = useRouter();
  const { user_id } = useLocalSearchParams<{ user_id: string }>();

  // ✅ Automatically send OTP when the screen loads
  useEffect(() => {
    const sendInitialOtp = async () => {
      try {
        const res = await axios.post('http://192.168.0.27:5000/api/send-otp', {
          user_id,
        });

        if (res.data.success) {
          Toast.show({
            type: 'success',
            text1: 'OTP Sent',
            text2: 'Please check your email.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'OTP Error',
            text2: res.data.message || 'Failed to send OTP',
          });
        }
      } catch (err) {
        console.error('OTP sending failed on load:', err);
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'Unable to send OTP. Check your connection.',
        });
      }
    };

    if (user_id) {
      sendInitialOtp();
    }
  }, [user_id]);

  // ✅ Handle typing in OTP fields
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ✅ Submit OTP for verification
  const handleVerify = async () => {
    if (otp.some((digit) => digit === '')) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete OTP',
        text2: 'Please complete all OTP fields',
      });
      return;
    }

    const code = otp.join('');
    try {
      const res = await axios.post('http://192.168.0.27:5000/api/verify-otp', {
        user_id,
        otp: code,
      });

      const data = res.data;

      if (data.success) {
        if (data.token) {
          await saveToken(data.token);
        }

        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: 'Redirecting...',
        });

        if (data.terms_accepted === 0) {
          router.push({ pathname: './BeforeProceed', params: { user_id } });
        } else if (data.terms_accepted === 1 && data.pin === null) {
          router.push({ pathname: './PinSetup', params: { user_id } });
        } else {
          router.push({ pathname: '../Home', params: { user_id } });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: data.message || 'Invalid OTP',
        });
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Could not verify OTP',
      });
    }
  };

  // ✅ Manual resend OTP
  const handleResendOtp = async () => {
    try {
      const res = await axios.post('http://192.168.0.27:5000/api/send-otp', {
        user_id,
      });

      if (res.data.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Check your email for the new code.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'OTP Send Failed',
          text2: res.data.message || 'Could not send OTP',
        });
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Failed to resend OTP',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>We need to make sure it's you</Text>
      <Text style={styles.description}>
        Please enter the One-time PIN (OTP) just sent to your registered email.
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
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleResendOtp} style={styles.resendButton}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleVerify} style={styles.verifyButton}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 24,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  resendButton: {
    marginBottom: 20,
  },
  resendText: {
    color: '#9993CC',
    fontSize: 16,
  },
  verifyButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Authentication;
