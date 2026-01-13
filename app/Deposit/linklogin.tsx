import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountLogin: React.FC = () => {
  const router = useRouter();
  const { selectedBank, userId } = useLocalSearchParams();

  const [accountNumber, setAccountNumber] = useState('');
  const [resolvedUserId, setResolvedUserId] = useState<number | null>(null);

  // Fetch user ID from AsyncStorage or passed parameter
  useEffect(() => {
    const resolveUserId = async () => {
      if (userId) {
        setResolvedUserId(parseInt(userId as string));
      } else {
        const storedId = await AsyncStorage.getItem('user_id');
        if (storedId) setResolvedUserId(parseInt(storedId));
      }
    };
    resolveUserId();
  }, [userId]);

  // Handle bank linking
  const handleLinkBank = async () => {
    if (!accountNumber) {
      Alert.alert('Missing Info', 'Please enter your account number');
      return;
    }

    if (!resolvedUserId || !selectedBank) {
      Alert.alert('Missing Data', 'User ID or bank selection is missing.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.6:5000/api/link-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: resolvedUserId,
          bank_name: selectedBank, // Correctly using selectedBank from params
          account_number: accountNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('./success'); // ✅ Redirect to the success page
      } else {
        Alert.alert('Linking Failed', result.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Error linking bank:', error);
      Alert.alert('Network Error', 'Failed to connect to the server.');
    }
  };

  const handleBackPress = () => {
    router.push('./linkaccount');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back-circle" size={40} color="#9993CC" />
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.header}>{selectedBank}</Text>
        <Text style={styles.subheading}>Link your {selectedBank} account</Text>
        <Text style={styles.description}>
          Enter your account number to link with Zenbank
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="numeric"
        />

        <Text style={styles.terms}>
          By clicking "Login", you authorize {selectedBank} to link your account
          to Zenbank, subject to its{' '}
          <Text style={styles.termsLink}>Terms and Conditions</Text>.
        </Text>

        <TouchableOpacity style={styles.loginButton} onPress={handleLinkBank}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  loginContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5F3D8F',
    textAlign: 'center',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  terms: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  termsLink: {
    color: '#5F3D8F',
  },
  loginButton: {
    backgroundColor: '#5F3D8F',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountLogin;
