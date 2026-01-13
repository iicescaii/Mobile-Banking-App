import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const AddDeposit: React.FC = () => {
  const router = useRouter();
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [internalAccounts, setInternalAccounts] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [linkedAccountId, setLinkedAccountId] = useState<number | null>(null);
  const [internalAccountId, setInternalAccountId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLinkedAccountName, setSelectedLinkedAccountName] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        setUserId(parseInt(storedUserId));
      } else {
        Alert.alert('Session Expired', 'You have been logged out. Please log in again.');
        router.push('../login/Login');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      // Fetch linked external accounts
      fetch(`http://172.20.10.4:5000/api/linked-accounts?user_id=${userId}`)
        .then((res) => res.json())
        .then(setLinkedAccounts)
        .catch((error) => {
          console.error(error);
          Alert.alert('Error', 'Failed to fetch linked accounts');
        });

      // Fetch internal bank accounts
      fetch(`http://172.20.10.4:5000/api/user-accounts?user_id=${userId}`)
        .then((res) => res.json())
        .then(setInternalAccounts)
        .catch((error) => {
          console.error(error);
          Alert.alert('Error', 'Failed to fetch internal bank accounts');
        });
    }
  }, [userId]);

  const openDepositModal = (id: number, name: string) => {
    setLinkedAccountId(id);
    setSelectedLinkedAccountName(name);
    setModalVisible(true);
    setInternalAccountId(null); // Reset selection on new modal open
    setAmount('');
  };

  const handleAddDeposit = async () => {
    if (!linkedAccountId) {
      Alert.alert('Error', 'Please select a linked account');
      return;
    }
    if (!internalAccountId) {
      Alert.alert('Error', 'Please select an internal account to deposit into');
      return;
    }
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.4:5000/api/add-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          linked_account_id: linkedAccountId,
          account_id: internalAccountId,
          amount: parseFloat(amount),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setModalVisible(false);
        setAmount('');
        setLinkedAccountId(null);
        setInternalAccountId(null);
        setSelectedLinkedAccountName('');

        Toast.show({
          type: 'success',
          text1: 'Deposit Successful',
          text2: `₱${amount} has been added.`,
          visibilityTime: 3000,
          position: 'top',
        });
      } else {
        Alert.alert('Failed', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error adding deposit:', error);
      Alert.alert('Error', 'Failed to add deposit');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('../components/Home')}>
        <Ionicons name="arrow-back-circle" size={40} color="#8681B6" />
      </TouchableOpacity>

      <Text style={styles.title}>Add Deposit</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Linked Accounts</Text>
        <Text style={styles.sectionDescription}>Tap an account to make a deposit</Text>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('./linkaccount')}>
          <Text style={styles.linkButtonText}>Link New Account</Text>
        </TouchableOpacity>

        {linkedAccounts.length > 0 ? (
          <View style={styles.linkedAccountsContainer}>
            <Text style={styles.linkedAccountsTitle}>Your Linked Accounts:</Text>
            {linkedAccounts.map((account) => (
              <TouchableOpacity
                key={account.linked_account_id}
                onPress={() => openDepositModal(account.linked_account_id, account.bank_name)}
                style={styles.linkedAccountItem}
              >
                <Text>{account.bank_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noLinkedAccounts}>No linked accounts yet.</Text>
        )}
      </View>

      {/* Deposit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Deposit from {selectedLinkedAccountName}</Text>

              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                Select Internal Account to Deposit Into:
              </Text>

              {internalAccounts.length > 0 ? (
                internalAccounts.map((acc) => (
                  <TouchableOpacity
                    key={acc.account_id}
                    style={[
                      styles.internalAccountItem,
                      internalAccountId === acc.account_id && styles.selectedInternalAccount,
                    ]}
                    onPress={() => setInternalAccountId(acc.account_id)}
                  >
                    <Text style={internalAccountId === acc.account_id ? { color: 'white' } : {}}>
                    {acc.account_label} - ₱{Number(acc.available_balance).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No internal accounts available</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Enter Deposit Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addButton} onPress={handleAddDeposit}>
                  <Text style={styles.addButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F7F7F7' },
  backButton: { position: 'absolute', top: 20, left: 10 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B3E9C',
    marginBottom: 30,
    marginTop: 60,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#6B3E9C' },
  sectionDescription: { fontSize: 14, color: '#6B3E9C', marginBottom: 15 },
  linkButton: {
    backgroundColor: '#8681B6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  linkButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  linkedAccountsContainer: { marginTop: 20 },
  linkedAccountsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B3E9C',
    marginBottom: 10,
  },
  linkedAccountItem: {
    fontSize: 14,
    color: '#6B3E9C',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  noLinkedAccounts: { fontSize: 14, color: '#6B3E9C', marginTop: 10 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '85%',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B3E9C',
    marginBottom: 10,
    textAlign: 'center',
  },
  internalAccountItem: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  selectedInternalAccount: {
    backgroundColor: '#6B3E9C',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 15,
    marginVertical: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#6B3E9C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default AddDeposit;
