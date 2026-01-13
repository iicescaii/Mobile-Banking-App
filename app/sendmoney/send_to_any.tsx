import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Modal, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

const SendToAnyScreen: React.FC = () => {
  const router = useRouter();

  // State for accounts and user
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Form state
  const [recipientName, setRecipientName] = useState('');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [sendFrom, setSendFrom] = useState('');
  const [sendFromId, setSendFromId] = useState<number | null>(null);
  const [showSendFromModal, setShowSendFromModal] = useState(false);
  const [toAccountId, setToAccountId] = useState<number | null>(null);

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
      setError('Failed to fetch user info');
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
      setError('Failed to load accounts. Please try again later.');
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
    if (!recipientNumber) {
      Alert.alert('Error', 'Please enter the recipient account number.');
      return false;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return false;
    }
    if (!sendFrom) {
      Alert.alert('Error', 'Please select an account to send from.');
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
    if (!fromAccount) {
      Alert.alert('Error', 'Account information is missing. Please try again.');
      setLoading(false);
      return;
    }
  
    // Fetch recipient account info if not already selected from your own accounts
    let recipientAccountId = toAccountId;
    let recipientAccountLabel = recipientName;
    if (!recipientAccountId) {
      try {
        const token = await getToken();
        const res = await axios.get(`${API_BASE_URL}/bank-account-by-number/${recipientNumber}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success && res.data.account) {
          recipientAccountId = res.data.account.account_id;
          recipientAccountLabel = res.data.account.account_label;
        } else {
          Alert.alert('Error', 'Recipient account not found.');
          setLoading(false);
          return;
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch recipient account.');
        setLoading(false);
        return;
      }
    }
    const transferData = {
      user_id: user.user_id,
      from_account_id: sendFromId ?? fromAccount.account_id,
      from_account_number: fromAccount.account_number,
      from_account_label: fromAccount.account_label,
      to_account_id: recipientAccountId,
      to_account_number: recipientNumber,
      to_account_label: recipientAccountLabel,
      amount,
      notes,
    };
  
    // Convert transferData to string record for router params
    const routerParams = Object.entries(transferData).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {} as Record<string, string>);

    setLoading(false);
    router.push({
      pathname: './confirmAny',
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
          <Text style={styles.header}>Any ZenBank Account</Text>
        </View>

        {/* Send To */}
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Send to</Text>
          <Text style={styles.inputLabel}>Account Name <Text style={{ color: '#888' }}>(Optional)</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account name"
            value={recipientName}
            onChangeText={setRecipientName}
          />
          <Text style={styles.inputLabel}>Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={recipientNumber}
            onChangeText={setRecipientNumber}
            keyboardType="numeric"
            maxLength={20}
          />
          <TouchableOpacity style={styles.favoritesBtn} onPress={() => Alert.alert('Favorites', 'Select from favorites (not implemented)')}>
            <Ionicons name="star-outline" size={20} color="#9993CC" />
            <Text style={styles.favoritesText}>Select from favorites</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Amount</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.currencyBox}><Text style={styles.currencyText}>PHP</Text></View>
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9.]/g, '');
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
          <Text style={styles.amountDescription}>
            Send money from PHP to PHP, or across the same foreign currencies.
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
              {sendFrom ? accounts.find(acc => acc.account_number === sendFrom)?.account_label : 'Select an account to send from'}
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
          <Text style={styles.label}>Notes <Text style={{ color: '#888' }}>(Optional)</Text></Text>
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
          <Text style={styles.sendText}>Send</Text>
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
    fontWeight: '600',
    color: '#444',
    margin: 5,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 15,
    color: '#888',
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 2,
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
  favoritesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  favoritesText: {
    color: '#9993CC',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '600',
  },
  currencyBox: {
    backgroundColor: '#F2EDFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    color: '#9993CC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  amountDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
    marginHorizontal: 20,
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

export default SendToAnyScreen;