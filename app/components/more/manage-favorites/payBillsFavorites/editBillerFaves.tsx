import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../../../utils/tokenStorage';

const EditFavoriteScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [subscriberAccountNumber, setSubscriberAccountNumber] = useState(
    (params.subscriber_account_number as string) || ''
  );
  const [subscriberAccountName, setSubscriberAccountName] = useState(
    (params.subscriber_account_name as string) || ''
  );
  const [favoriteNickname, setFavoriteNickname] = useState(
    (params.favorite_nickname as string) || ''
  );

  const original = {
    subscriber_account_number: (params.subscriber_account_number as string) || '',
    subscriber_account_name: (params.subscriber_account_name as string) || '',
    favorite_nickname: (params.favorite_nickname as string) || '',
  };

  const handleSave = async () => {
    if (
      subscriberAccountNumber === original.subscriber_account_number &&
      subscriberAccountName === original.subscriber_account_name &&
      favoriteNickname === original.favorite_nickname
    ) {
      Alert.alert('No changes detected', 'Please modify at least one field before saving.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error('No token found');

      if (!params.favorite_id) {
        Alert.alert('Error', 'No favorite selected for update.');
        return;
      }

      const payload = {
        biller_name: params.biller_name,
        subscriber_account_number: subscriberAccountNumber,
        subscriber_account_name: subscriberAccountName,
        favorite_nickname: favoriteNickname,
      };

      await axios.put(
        `http://192.168.1.7:5000/api/favorite-biller/${params.favorite_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.replace({
        pathname: '/components/more/manage-favorites/payBillsFavorites/biller-faves-updated',
        params: { nickname: favoriteNickname },
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to update favorite. Please try again.');
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push({
            pathname: '/components/more/manage-favorites/payBillsFavorites/viewEditBillerFaves',
            params: {
              favorite_id: params.favorite_id,
              user_id: params.user_id,
              biller_name: params.biller_name,
              subscriber_account_number: params.subscriber_account_number,
              subscriber_account_name: params.subscriber_account_name,
              favorite_nickname: params.favorite_nickname,
              created_at: params.created_at,
              updated_at: params.updated_at
            }
          })}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Favorite</Text>
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Subscriber Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={subscriberAccountNumber}
            onChangeText={setSubscriberAccountNumber}
          />
           <Text style={styles.inputLabel}>Subscriber Account Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account name"
            value={subscriberAccountName}
            onChangeText={setSubscriberAccountName}
          />
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Favorite Nickname</Text>
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