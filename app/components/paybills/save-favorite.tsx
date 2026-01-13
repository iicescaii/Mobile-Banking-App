import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getToken } from '../../utils/tokenStorage';

const SaveFavoriteScreen = () => {
  const router = useRouter();
  const { biller_id, biller_name, subscriberAccountNumber, subscriberAccountName } = useLocalSearchParams();
  const [nickname, setNickname] = useState(biller_name as string || '');

  // Use your fetchCurrentUser logic here
  const fetchCurrentUser = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://172.20.10.4:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch user info');
      return null;
    }
  };

  const handleSave = async () => {
  try {
    const user = await fetchCurrentUser();
    if (!user || !user.user_id) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    const token = await getToken();
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }
    const response = await axios.post(
          'http://172.20.10.4:5000/api/favorite-biller',
          {
            user_id: user.user_id,
            biller_id: biller_id,
            biller_name: biller_name,
            subscriber_account_number: subscriberAccountNumber,
            subscriber_account_name: subscriberAccountName,
            favorite_nickname: nickname,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data.success) {
            router.push({
                pathname: '/components/paybills/saved-fave',
                params: { nickname }
            });
        } else {
          Alert.alert('Error', response.data.message || 'Failed to save favorite');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to save favorite');
      }
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={28} color="#9993CC" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Save as Favorite</Text>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Biller</Text>
        <Text style={styles.value}>{biller_name || '-'}</Text>

        <Text style={styles.label}>Subscriber Account Number</Text>
        <Text style={styles.value}>{subscriberAccountNumber || '-'}</Text>

        <Text style={styles.label}>Subscriber Account Name</Text>
        <Text style={styles.value}>{subscriberAccountName || '-'}</Text>
      </View>

      {/* Input */}
      <Text style={styles.inputLabel}>Favorite Nickname</Text>
      <TextInput
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
        placeholder="Enter nickname"
        placeholderTextColor="#aaa"
      />

      {/* Save button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SaveFavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes the full height of the screen
    padding: 24,
    backgroundColor: '#f5f5f5',

  },
  backBtn: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    color: '#333',
    paddingLeft: 10,
  },
  value: {
    fontSize: 14,
    color: '#444',
    paddingLeft: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  saveBtn: {
    backgroundColor: '#9993CC',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '90%',  // Full width
    position: 'absolute', // Fixed position
    bottom: 24, // Adjust space from the bottom
    alignSelf: 'center',  // Center align the button
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});