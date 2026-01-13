import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../../../utils/tokenStorage';

const AddFavoriteScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [subscriberAccountNumber, setSubscriberAccountNumber] = useState('');
  const [subscriberAccountName, setSubscriberAccountName] = useState('');
  const [favoriteNickname, setFavoriteNickname] = useState('');

  const handleSave = async () => {
    if (!subscriberAccountNumber || !subscriberAccountName || !favoriteNickname) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const token = await getToken();
      if (!token) throw new Error('No token found');
      const payload = {
        biller_id: params.biller_id,
        biller_name: params.biller_name,
        subscriber_account_number: subscriberAccountNumber,
        subscriber_account_name: subscriberAccountName,
        favorite_nickname: favoriteNickname,
      };
      await axios.post(
        'http://192.168.1.7:5000/api/favorite-biller',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.replace('/components/more/manage-favorites/payBillsFavorites/payBillsFavoritesScreen');
    } catch (err) {
      Alert.alert('Error', 'Failed to add favorite. Please try again.');
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FAFAFA' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Favorite</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        {/* Pay To */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Pay To</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f5f5f5' }]}
            value={params.biller_name as string}
            editable={false}
          />
        </View>

        {/* Subscriber Account Number */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Subscriber Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={subscriberAccountNumber}
            onChangeText={setSubscriberAccountNumber}
            keyboardType="default"
          />
          <Text style={styles.inputLabel}>Subscriber Account Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account name"
            value={subscriberAccountName}
            onChangeText={setSubscriberAccountName}
            keyboardType="default"
          />
        </View>

        {/* Favorite Nickname */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Favorite Nickname</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a note"
            value={favoriteNickname}
            onChangeText={setFavoriteNickname}
            keyboardType="default"
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#9993CC',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  backButton: { marginRight: 10 },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
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
  saveButton: {
    backgroundColor: '#b3a0d6',
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

export default AddFavoriteScreen;