import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../utils/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PaymentData {
  user_id: string;
  pay_from_account_id: string;
  pay_from_account_number: string;
  pay_from_account_nickname: string;
  pay_from_account_balance: string;
  subscriber_account_number: string;
  subscriber_account_name: string;
  amount: string;
  notes?: string;
  biller_id: string;
  biller_name: string;
}

const MAX_PIN_ATTEMPTS = 3; // Reduced from 100 for better security
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.4:5000/api';

const getStringParam = (param: string | string[] | undefined) =>
  Array.isArray(param) ? param[0] : param || '';

const EnterPinScreen = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Check if user is locked out
    const checkLockout = async () => {
      try {
        const storedLockoutEndTime = await AsyncStorage.getItem('pinLockoutEndTime');
        if (storedLockoutEndTime) {
          const endTime = parseInt(storedLockoutEndTime);
          if (endTime > Date.now()) {
            setLockoutEndTime(endTime);
          } else {
            await AsyncStorage.removeItem('pinLockoutEndTime');
          }
        }
      } catch (error) {
        console.error('Error checking lockout status:', error);
      }
    };
    
    checkLockout();
  }, []);

  const handleInvalidPin = async () => {
    setLoading(false);
    const newAttempts = pinAttempts + 1;
    setPinAttempts(newAttempts);
    if (newAttempts >= MAX_PIN_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_DURATION;
      setLockoutEndTime(lockoutTime);
      try {
        await AsyncStorage.setItem('pinLockoutEndTime', lockoutTime.toString());
      } catch (error) {
        console.error('Error saving lockout time:', error);
      }
      Alert.alert('Account Locked', `Too many failed attempts. Please try again in ${LOCKOUT_DURATION / 1000 / 60} minutes.`);
    } else {
      Alert.alert('Error', `Invalid PIN. ${MAX_PIN_ATTEMPTS - newAttempts} attempts remaining.`);
    }
    setPin('');
  };

  const handlePress = (value: string) => {

    // Prevent input if loading or locked out
    if (loading || (lockoutEndTime && Date.now() < lockoutEndTime)) {
      console.log('Input prevented - loading:', loading, 'locked out:', lockoutEndTime && Date.now() < lockoutEndTime); // Debug log
      return;
    }

    // Handle backspace
    if (value === 'back') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }

    // Only allow numeric input
    if (!/^\d$/.test(value)) {
      return;
    }

    // Limit to 6 digits
    if (pin.length >= 6) {
      return;
    }

    // Add digit and check if we should submit
    const newPin = pin + value;
    setPin(newPin);
    
    // Auto-submit when 6 digits are entered
    if (newPin.length === 6) {
      // Use the newPin value directly instead of relying on state
      setTimeout(() => {
        handlePinSubmit(newPin); // Pass the complete PIN directly
      }, 300);
    }
  };

const handlePinSubmit = async (submittedPin: string = pin) => {
  if (!params.user_id) {
    Alert.alert('Error', 'Payment data is missing');
    return;
  }

  // Validate PIN format
  if (!/^\d{6}$/.test(submittedPin)) {
    Alert.alert('Error', 'PIN must be exactly 6 digits');
    setPin('');
    return;
  }

  if (lockoutEndTime && Date.now() < lockoutEndTime) {
    const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60);
    Alert.alert('Account Locked', `Too many failed attempts. Please try again in ${remainingTime} minutes.`);
    return;
  }

  setLoading(true);
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // First verify PIN
    const verifyResponse = await axios.post(`${API_BASE_URL}/verify-pin`, {
      user_id: params.user_id,
      pin: submittedPin,
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (verifyResponse.data.success) {
      // Reset PIN attempts on successful verification
      setPinAttempts(0);
      await AsyncStorage.removeItem('pinLockoutEndTime');

      // Process payment
      const paymentUrl = `${API_BASE_URL}/pay-bills`;
      const paymentData = {
        user_id: params.user_id,
        pay_from_account_id: params.pay_from_account_id,
        subscriber_account_number: params.subscriber_account_number,
        subscriber_account_name: params.subscriber_account_name,
        amount: params.amount,
        notes: params.notes,
        biller_id: params.biller_id,
        biller_name: params.biller_name,
      };

      console.log('Sending payment data:', paymentData); // Debug log

      const paymentResponse = await axios.post(paymentUrl, paymentData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (paymentResponse.data.success) {
        const favoriteId = getStringParam(params.favorite_id);
        const referenceCode = String(paymentResponse.data.reference_code || '');
        
        // Navigate to confirmation screen
        router.push({
          pathname: '/components/paybills/payment_confirm',
          params: {
            amount: params.amount,
            biller_id: params.biller_id,
            biller_name: params.biller_name,
            subscriberAccountName: params.subscriber_account_name,
            subscriberAccountNumber: params.subscriber_account_number,
            nickname: params.pay_from_account_nickname,
            payerAccountNumber: params.pay_from_account_number,
            referenceCode: referenceCode,
            createdAt: new Date().toISOString(),
            favorite_id: favoriteId,
          }
        });
      } else {
        Alert.alert('Error', paymentResponse.data.message || 'Payment failed');
        setPin('');
      }
    } else {
      handleInvalidPin();
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Payment error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });

      if (error.response?.status === 400) {
        Alert.alert('Error', error.response.data?.message || 'Invalid payment data');
      } else if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please log in again to continue.');
        router.replace('/');
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'Payment service is currently unavailable. Please try again later.');
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to process payment. Please try again.');
      }
    } else {
      Alert.alert('Error', 'An unexpected error occurred while processing payment.');
    }
    setPin('');
  } finally {
    setLoading(false);
  }
}; 

  const renderKey = (label: string | number) => {
    return (
      <TouchableOpacity
        key={label}
        style={[
          styles.key,
          (loading || (lockoutEndTime !== null && Date.now() < lockoutEndTime)) ? styles.disabledKey : undefined,
          label === 'back' ? styles.backspaceKey : undefined
        ]}
        onPress={() => {
          handlePress(String(label));
        }}
        disabled={loading || (lockoutEndTime !== null && Date.now() < lockoutEndTime)}
      >
        {label === 'back' ? (
          <Ionicons name="backspace" size={24} color="#9993CC" />
        ) : (
          <Text style={[
            styles.keyText,
            label === 0 ? styles.zeroKey : undefined
          ]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={28} color="#9993CC" />
      </TouchableOpacity>

      <Text style={styles.title}>Enter your 6-digit PIN to continue</Text>

      <View style={styles.pinContainer}>
        {[...Array(6)].map((_, index) => (
          <View key={index} style={[
            styles.pinDot,
            pin.length > index ? styles.filledPinDot : null
          ]}>
            {pin.length > index && <View style={styles.filledDot} />}
          </View>
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9993CC" />
          <Text style={styles.loadingText}>Processing payment...</Text>
        </View>
      )}

      {lockoutEndTime && Date.now() < lockoutEndTime && (
        <Text style={styles.lockoutText}>
          Account locked. Please try again in {Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)} minutes.
        </Text>
      )}

      <Text style={styles.forgotText}>
        Forgot <Text style={{ color: '#9993CC', fontWeight: '600' }}>PIN?</Text> click here.
      </Text>

      <View style={styles.pad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'back'].map((item, i) =>
          item !== '' ? renderKey(item) : <View key={`empty-${i}`} style={styles.key} />
        )}
      </View>
    </View>
  );
};

export default EnterPinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 50,
    paddingHorizontal: 50,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  pinDot: {
    width: 50,
    height: 65,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  filledPinDot: {
    borderColor: '#9993CC',
    backgroundColor: '#f0f0f0',
  },
  filledDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9993CC',
  },
  forgotText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
  },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  key: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  keyText: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#9993CC',
    fontSize: 16,
  },
  disabledKey: {
    opacity: 0.5,
  },
  lockoutText: {
    textAlign: 'center',
    color: '#ff3b30',
    fontSize: 14,
    marginVertical: 10,
  },
  backspaceKey: {
    backgroundColor: '#f8f8f8',
  },
  zeroKey: {
    fontSize: 32, // Slightly larger for zero
  },
  debugText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
});