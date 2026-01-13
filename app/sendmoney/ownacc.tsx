import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Modal, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { getToken, deleteToken } from '../utils/tokenStorage';

const API_BASE_URL = 'http://192.168.1.7:5000/api';

interface User {
  user_id: number;
  username?: string;
}

interface Account {
  account_id: number;
  account_number: string;
  account_label: string;
  balance: string;
}

interface TransferData {
  user_id: number;
  from_account_id: number;
  from_account_number: string;
  from_account_label: string;
  to_account_id: number;
  to_account_number: string;
  to_account_label: string;
  amount: string;
  notes?: string;
}

const OwnAccountScreen: React.FC = () => {
  const router = useRouter();
  
  // State for accounts and user
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Form state
  const [sendTo, setSendTo] = useState('');
  const [sendFrom, setSendFrom] = useState('');
  const [sendToId, setSendToId] = useState<number | null>(null);
  const [sendFromId, setSendFromId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [showSendToModal, setShowSendToModal] = useState(false);
  const [showSendFromModal, setShowSendFromModal] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchAccounts();
    fetchCurrentUser();
  };

  const handleBackPress = () => {
    router.back();
  };

  const validateForm = () => {
    if (!user) {
      Alert.alert('Error', 'User information is missing. Please try again.');
      return false;
    }
    if (!sendFrom) {
      Alert.alert('Error', 'Please select an account to send from.');
      return false;
    }
    if (!sendTo) {
      Alert.alert('Error', 'Please select an account to send to.');
      return false;
    }
    if (sendFrom === sendTo) {
      Alert.alert('Error', 'Cannot send to the same account.');
      return false;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return false;
    }

    const fromAccount = accounts.find(acc => acc.account_number === sendFrom);
    if (!fromAccount || Number(amount) > Number(fromAccount.balance)) {
      Alert.alert('Error', 'Insufficient balance in the selected account.');
      return false;
    }

    return true;
  };

  const handleSendPress = async () => {
    if (!validateForm() || !user) {
      return;
    }

    setLoading(true);

    const fromAccount = accounts.find(acc => acc.account_number === sendFrom);
    const toAccount = accounts.find(acc => acc.account_number === sendTo);

    if (!fromAccount || !toAccount) {
      Alert.alert('Error', 'Account information is missing. Please try again.');
      setLoading(false);
      return;
    }

    const transferData: TransferData = {
      user_id: user.user_id,
      from_account_id: sendFromId ?? fromAccount.account_id,
      from_account_number: fromAccount.account_number,
      from_account_label: fromAccount.account_label,
      to_account_id: sendToId ?? toAccount.account_id,
      to_account_number: toAccount.account_number,
      to_account_label: toAccount.account_label,
      amount,
      notes,
    };

    // Convert TransferData to string record for router params
    const routerParams = Object.entries(transferData).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {} as Record<string, string>);

    router.push({
      pathname: './confirmOwn',
      params: routerParams,
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
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.header}>Own Account</Text>
        </View>

        {/* Send To */}
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Send To</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowSendToModal(true)}
          >
            <Text style={styles.pickerText}>
              {sendTo ? accounts.find(acc => acc.account_number === sendTo)?.account_label : 'Select an account'}
            </Text>
          </TouchableOpacity>
          <Modal visible={showSendToModal} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Select Account</Text>
                {accounts.map((account) => (
                  <TouchableOpacity
                    key={account.account_id}
                    style={styles.modalItem}
                    onPress={() => {
                      setSendTo(account.account_number);
                      setSendToId(account.account_id);
                      setShowSendToModal(false);
                    }}
                  >
                    <Text style={styles.modalText}>
                      {account.account_label}{'\n'}<Text style={styles.accountNumberText}>Account No. {account.account_number}</Text>
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowSendToModal(false)}
                >
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* Amount */}
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
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
          <Text style={styles.amountDescription}>
            Send Money from PHP to PHP only.
          </Text>
        </View>

        {/* Send From */}
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Send From</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowSendFromModal(true)}
          >
            <Text style={styles.pickerText}>
              {sendFrom ? accounts.find(acc => acc.account_number === sendFrom)?.account_label : 'Select an account'}
            </Text>
          </TouchableOpacity>

          <Modal visible={showSendFromModal} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Select Account</Text>
                {accounts.map((account) => (
                  <TouchableOpacity
                    key={account.account_id}
                    style={styles.modalItem}
                    onPress={() => {
                      setSendFrom(account.account_number);
                      setSendFromId(account.account_id);
                      setShowSendFromModal(false);
                    }}
                  >
                    <Text style={styles.modalText}>
                      {account.account_label}{'\n'}<Text style={styles.accountNumberText}>Account No. {account.account_number}</Text>
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowSendFromModal(false)}
                >
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* Notes */}
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a note"
            value={notes}
            onChangeText={setNotes}
            maxLength={200}
            multiline
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendBtn, loading && { opacity: 0.6 }]}
          onPress={handleSendPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: '#F8F8F8',
    margin: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#9993CC',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 0,
  },
  backBtn: {
    padding: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  sectionContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
    margin: 5,
    marginTop: 10,
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    margin: 10,
    color: '#888',
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
  },
  pickerText: {
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6B3E9C',
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalText: {
    fontSize: 16,
    color: '#6B3E9C',
  },
  accountNumberText: {
    fontSize: 14,
    color: '#888',
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#9993CC',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    margin: 10,
    color: '#888',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  amountDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
    marginHorizontal: 20,
  },
  sendBtn: {
    backgroundColor: '#9993CC',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 40,
  },
  sendText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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

export default OwnAccountScreen;
