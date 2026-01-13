import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../../../utils/tokenStorage';

const EditFavoriteScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Destructure all params at the top
  const favorite_receiver_id = String(params.favorite_receiver_id || '');
  const receiver_name = String(params.receiver_name || '');
  const receiver_account_number = String(params.receiver_account_number || '');
  const favorite_nickname = String(params.favorite_nickname || '');
  const amount = String(params.amount || '0');
  const receiver_account_id = String(params.receiver_account_id || '');

  // Update state to use receiver fields
  const [receiverAccountNumber, setReceiverAccountNumber] = useState(receiver_account_number);
  const [receiverName, setReceiverName] = useState(receiver_name);
  const [favoriteNickname, setFavoriteNickname] = useState(favorite_nickname);
  const [amountValue, setAmountValue] = useState(amount);

  const original = {
    receiver_account_number,
    receiver_name,
    favorite_nickname,
    amount,
    receiver_account_id 
  };

  const handleAmountChange = (text: string) => {
  // Remove any non-numeric characters except decimal point
  let numericValue = text.replace(/[^0-9.]/g, '');
  
  // Handle empty input
  if (numericValue === '') {
    setAmountValue('');
    return;
  }

  // Ensure only one decimal point
  const parts = numericValue.split('.');
  if (parts.length > 2) {
    numericValue = parts[0] + '.' + parts[1];
  }

  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) {
    numericValue = parts[0] + '.' + parts[1].substring(0, 2);
  }

  // Remove leading zeros
  if (numericValue.startsWith('0') && numericValue.length > 1 && !numericValue.startsWith('0.')) {
    numericValue = numericValue.substring(1);
  }

  // Handle decimal point at start
  if (numericValue.startsWith('.')) {
    numericValue = '0' + numericValue;
  }

  setAmountValue(numericValue);
};

  const handleSave = async () => {
    if (
      receiverAccountNumber === original.receiver_account_number &&
      receiverName === original.receiver_name &&
      favoriteNickname === original.favorite_nickname &&
      amountValue === original.amount
    ) {
      Alert.alert('No changes detected', 'Please modify at least one field before saving.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error('No token found');

      if (!favorite_receiver_id) {
        Alert.alert('Error', 'No favorite selected for update.');
        return;
      }

      const payload = {
        receiver_name: receiverName,
        receiver_account_number: receiverAccountNumber,
        favorite_nickname: favoriteNickname,
        amount: amountValue,
         receiver_account_id: receiver_account_id 
      };

      await axios.put(
        `http://192.168.1.7:5000/api/favorite-receiver/${favorite_receiver_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.replace({
        pathname: '/components/more/manage-favorites/sendMoneyFavorites/receiver-faves-updated',
        params: { nickname: favoriteNickname },
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to update favorite. Please try again.');
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push({ 
            pathname: '/components/more/manage-favorites/sendMoneyFavorites/viewEditSendMoneyFaves',
            params: {
              favorite_receiver_id,
              receiver_name,
              receiver_account_number,
              favorite_nickname,
              amount,
              receiver_account_id
            }
          })}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Favorite</Text>
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

        {/* Amount */}
        <View style={styles.formCard}>
          <Text style={styles.label}>
            <Text style={styles.inputLabel}>Amount</Text>
          </Text>
            <TextInput
              style={[styles.amountInput, { flex: 1 }]}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amountValue}
              onChangeText={handleAmountChange}
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

export default EditFavoriteScreen;

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