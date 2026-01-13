import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getToken, deleteToken } from '../../utils/tokenStorage';

const API_BASE_URL = 'http://172.20.10.4:5000/api';

interface User {
  user_id: number;
  username?: string;
}

interface PaymentData {
  user_id: number;
  pay_from_account_id: number;
  pay_from_account_number: string;
  pay_from_account_nickname: string;
  pay_from_account_balance: string;
  subscriber_account_number: string;
  subscriber_account_name: string;
  amount: string;
  notes?: string;
  biller_id: number;
  biller_name: string;
}

const getStringParam = (param: string | string[] | undefined) =>
  Array.isArray(param) ? param[0] : param || '';

const PayBillForm = () => {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const favoriteId = getStringParam(params.favorite_id);

  // Extract params for biller and account info
  const [selectedBiller, setSelectedBiller] = useState(getStringParam(params.biller_name));
  const [selectedBillerId, setSelectedBillerId] = useState(getStringParam(params.biller_id));
  const [selectedAccountId, setSelectedAccountId] = useState(getStringParam(params.selectedAccountId));
  const [nickname, setNickname] = useState(getStringParam(params.nickname));
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(getStringParam(params.accountNumber));
  const [availableBalance, setAvailableBalance] = useState(getStringParam(params.availableBalance));

  // Form state
  const [subscriberAccountNumber, setSubscriberAccountNumber] = useState(getStringParam(params.subscriberAccountNumber));
  const [subscriberName, setSubscriberName] = useState(getStringParam(params.subscriberName));
  const [amount, setAmount] = useState(getStringParam(params.amount));
  const [notes, setNotes] = useState(getStringParam(params.notes));
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleTokenError = () => {
    setError('Your session has expired. Please log in again.');
    deleteToken();
    router.replace('/');
  };

  const fetchCurrentUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        handleTokenError();
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleTokenError();
      } else {
        setError('Failed to fetch user info');
      }
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = await getToken();
      if (!token) {
        handleTokenError();
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/bank-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAccounts(response.data.accounts);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to load accounts');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          handleTokenError();
        } else if (error.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server. Please check your internet connection.');
        } else if (error.response?.status === 404) {
          setError('API endpoint not found. Please check the server configuration.');
        } else {
          setError(error.response?.data?.message || 'Failed to load accounts. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCurrentUser();
    fetchAccounts();
  }, []);

  useEffect(() => {
    setSelectedBiller(getStringParam(params.biller_name));
    setSelectedBillerId(getStringParam(params.biller_id));
    setSubscriberAccountNumber(getStringParam(params.subscriberAccountNumber));
    setSubscriberName(getStringParam(params.subscriberName));
    setAmount(getStringParam(params.amount));
    setNotes(getStringParam(params.notes));
    setSelectedAccountId(getStringParam(params.selectedAccountId));
    setNickname(getStringParam(params.nickname));
    setSelectedAccountNumber(getStringParam(params.accountNumber));
    setAvailableBalance(getStringParam(params.availableBalance));
  }, [params]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAccounts();
    fetchCurrentUser();
  };

  const validateForm = () => {
    if (!user) {
      Alert.alert('Error', 'User information is missing. Please try again.');
      return false;
    }
    if (!selectedAccountId || !selectedAccountNumber || !nickname || !availableBalance) {
      Alert.alert('Error', 'Please select an account to pay from.');
      return false;
    }
    if (!subscriberAccountNumber || !subscriberName) {
      Alert.alert('Error', 'Please enter subscriber account details.');
      return false;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return false;
    }
    if (!selectedBillerId || !selectedBiller) {
      Alert.alert('Error', 'Biller information is missing. Please try again.');
      return false;
    }
    if (Number(amount) > Number(availableBalance)) {
      Alert.alert('Error', 'Insufficient balance in the selected account.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) {
      return;
    }

    setLoading(true);

    const paymentData: PaymentData = {
      user_id: user.user_id,
      pay_from_account_id: parseInt(selectedAccountId),
      pay_from_account_number: selectedAccountNumber,
      pay_from_account_nickname: nickname,
      pay_from_account_balance: availableBalance,
      subscriber_account_number: subscriberAccountNumber,
      subscriber_account_name: subscriberName,
      amount,
      notes,
      biller_id: parseInt(selectedBillerId),
      biller_name: selectedBiller,
    };
    
    // Convert PaymentData to string record for router params
    const routerParams = Object.entries(paymentData).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {} as Record<string, string>);

    router.push({
      pathname: '/components/paybills/ConfirmDetails',
      params:  { ...routerParams, favorite_id:favoriteId },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9993CC" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/components/paybills/SelectBillers')}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay Bills</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Pay To</Text>
          <View style={styles.payToBox}>
            <Text style={styles.billerName}>{selectedBiller || 'No biller selected'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Subscriber Account Number (Bill/Account to Pay)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the bill/account number to pay"
            keyboardType="numeric"
            value={subscriberAccountNumber}
            onChangeText={setSubscriberAccountNumber}
            maxLength={20}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Subscriber Account Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter subscriber name"
            value={subscriberName}
            onChangeText={setSubscriberName}
            maxLength={100}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => {
              // Only allow numbers and decimal point
              const numericValue = text.replace(/[^0-9.]/g, '');
              // Ensure only one decimal point
              const parts = numericValue.split('.');
              if (parts.length > 2) {
                setAmount(parts[0] + '.' + parts.slice(1).join(''));
              } else {
                setAmount(numericValue);
              }
            }}
            maxLength={15}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pay From</Text>
          <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                router.push({
                  pathname: '/components/paybills/SelectAccount',
                  params: {
                    biller_id: selectedBillerId,
                    biller_name: selectedBiller,
                    subscriberAccountNumber,
                    subscriberName,
                    amount,
                    notes,
                    favoriteId,
                  },
                })
              }
            >
              {nickname && selectedAccountNumber && availableBalance !== undefined ? (
                <View>
                  <Text
                    style={{
                      color: '#9993CC',
                      fontWeight: 'bold',
                      fontSize: 17,
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {nickname}
                  </Text>
                  <Text style={{ color: '#888', fontSize: 15, marginTop: 2 }}>Available Balance</Text>
                  <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 18, marginTop: 2 }}>
                    PHP {Number(availableBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              ) : (
                <Text style={styles.dropdownText}>Select an account to pay from</Text>
              )}
              <Ionicons name="chevron-down" size={18} color="#9993CC" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter any additional notes"
            value={notes}
            onChangeText={setNotes}
            maxLength={200}
            multiline
          />
        </View>

        <TouchableOpacity 
          style={[styles.payButton, loading && styles.disabledButton]} 
          onPress={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PayBillForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#9993CC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  payToBox: {
    backgroundColor: '#E0E0E0',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  billerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#9993CC',
    padding: 16,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});