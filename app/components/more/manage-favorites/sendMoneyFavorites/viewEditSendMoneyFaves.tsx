import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../../../utils/tokenStorage';

const ProfileDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Destructure params and ensure they are strings
  const favorite_receiver_id = String(params.favorite_receiver_id || '');
  const receiver_name = String(params.receiver_name || '');
  const receiver_account_number = String(params.receiver_account_number || '');
  const favorite_nickname = String(params.favorite_nickname || '');
  const amount = String(params.amount || '0');
  const receiver_account_id = String(params.receiver_account_id || ''); 

  // Delete logic
  const handleDelete = async () => {
    try {
      const token = await getToken();
      await axios.delete(
        `http://192.168.1.7:5000/api/favorite-receiver/${favorite_receiver_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Go back or refresh list after delete
      router.replace('/components/more/manage-favorites/sendMoneyFavorites/sendMoneyFaves');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete favorite. Please try again.');
      console.error(err);
    }
  };

  // Edit logic (navigate to edit screen)
  const handleEdit = () => {
    router.push({
      pathname: '/components/more/manage-favorites/sendMoneyFavorites/editSendMoneyFaves',
      params: {
        favorite_receiver_id,
        receiver_name,
        receiver_account_number,
        favorite_nickname,
        amount,
        receiver_account_id,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/components/more/manage-favorites/sendMoneyFavorites/sendMoneyFaves')}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Account Details</Text>
      </View>

      {/* Profile Info */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Ionicons
            name="person-circle"
            size={60}
            color="#9993CC"
            style={styles.profileIcon}
          />
          <Text style={styles.profileName}>{favorite_nickname}</Text>
        </View>

        {/* Account Details */}
        <View style={styles.detailsWrapper}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Account Name</Text>
            <Text style={styles.detailsText}>{receiver_name}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Account Number</Text>
            <Text style={styles.detailsText}>{receiver_account_number}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Amount</Text>
            <Text style={styles.detailsText}>
              PHP {parseFloat(amount).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons at Bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#9993CC',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 160, // Add enough bottom padding so content is not hidden behind buttons
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    marginRight: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  detailsWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  detailsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    paddingHorizontal: 24,
  },
  editButton: {
    backgroundColor: '#AFA3D8',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#AFA3D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#AFA3D8',
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteButtonText: {
    color: '#AFA3D8',
    fontSize: 20,
    fontWeight: 'bold',
  },
});