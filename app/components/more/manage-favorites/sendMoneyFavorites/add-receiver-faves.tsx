import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../../../utils/tokenStorage';

const AddFavoriteReceiverScreen = () => {
  const router = useRouter();

  // Use the same UI fields, but for receiver
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [favoriteNickname, setFavoriteNickname] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

const handleSave = async () => {
    setErrorMessage('');
  if (!receiverAccountNumber || !receiverName || !favoriteNickname || !amount) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  try {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const payload = {
      receiver_name: receiverName,
      receiver_account_number: receiverAccountNumber,
      favorite_nickname: favoriteNickname,
      amount: parseFloat(amount),
    };

    await axios.post(
      'http://192.168.1.7:5000/api/favorite-receiver',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.replace('/components/more/manage-favorites/sendMoneyFavorites/sendMoneyFaves');
} catch (err) {
  if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
    setErrorMessage('Bank account not found. Please check the account number.');
  } else {
    Alert.alert('Error', 'Failed to add favorite. Please try again.');
  }
  console.error(err);
}
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F7F7F7' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Favorite</Text>
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          {/* Account Name */}
          <Text style={styles.label}>
            <Text style={styles.inputLabel}>Account Name</Text>
            <Text style={styles.labelOptional}> (Optional)</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account name"
            value={receiverName}
            onChangeText={setReceiverName}
          />

          {/* Account Number */}
          <Text style={[styles.label, { marginTop: 20 }]}>
            <Text style={styles.inputLabel}>Account Number</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={receiverAccountNumber}
            onChangeText={setReceiverAccountNumber}
            keyboardType="number-pad"
          />
        </View>
        {errorMessage ? (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>
          {errorMessage}
        </Text>
      ) : null}
        {/* Amount */}
        <View style={styles.formCard}>
          <Text style={styles.label}>
            <Text style={styles.inputLabel}>Amount</Text>
          </Text>
          <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="number-pad"
                editable={true}
                value={amount}
                onChangeText={setAmount}
          />
          <Text style={styles.amountNote}>Send money from PHP to PHP</Text>
        </View>

        {/* Favorite Nickname */}
        <View style={styles.formCard}>
          <Text style={styles.label}>
            <Text style={styles.inputLabel}>Favorite Nickname</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a note"
            value={favoriteNickname}
            onChangeText={setFavoriteNickname}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default AddFavoriteReceiverScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#9993CC',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingTop: 24,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
    color: '#222',
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  labelOptional: {
    fontWeight: '400',
    color: '#444',
    fontSize: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#9993CC',
    marginBottom: 10,
  },
  amountInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#9993CC',
    marginBottom: 10,
  },
  amountNote: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});