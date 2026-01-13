import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../../../utils/tokenStorage';


const FavoriteDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Destructure the params for easier use
  const {
  favorite_id,
  user_id,
  biller_name,
  subscriber_account_number,
  subscriber_account_name,
  favorite_nickname,
  created_at,
  updated_at
} = params;
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() =>   router.push('/components/more/manage-favorites/payBillsFavorites/payBillsFavoritesScreen')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Favorite Details */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
         <Ionicons name="person-circle" size={60} color="#9993CC" style={styles.profileIcon} />
          <Text style={styles.headerText}>{favorite_nickname}</Text>

        <View style={styles.favoriteDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Biller</Text>
            <Text style={styles.detailText}>{biller_name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Subscriber Account Number</Text>
            <Text style={styles.detailText}>{subscriber_account_number}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Subscriber Account Name</Text>
            <Text style={styles.detailText}>{subscriber_account_name}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit and Delete Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push({
            pathname: '/components/more/manage-favorites/payBillsFavorites/editBillerFaves',
            params: {
               favorite_id: params.favorite_id,
                user_id: params.user_id,
                biller_name: params.biller_name,
                subscriber_account_number: params.subscriber_account_number,
                subscriber_account_name: params.subscriber_account_name,
                favorite_nickname: params.favorite_nickname,
                created_at: params.created_at,
                updated_at: params.updated_at
            },
          })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={async () => {
            try {
              const token = await getToken();
              await axios.delete(
                `http://192.168.1.7:5000/api/favorite-biller/${params.favorite_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              // Refetch the favorites list
              const res = await axios.get('http://192.168.1.7:5000/api/favorite-billers', {
                headers: { Authorization: `Bearer ${token}` }
              });
              const favorites = res.data || [];
              if (favorites.length === 0) {
                router.replace('/components/more/manage-favorites/payBillsFavorites/NoFavoritesScreen');
              } else {
                router.replace('/components/more/manage-favorites/payBillsFavorites/payBillsFavoritesScreen');
              }
            } catch (err) {
              alert('Failed to delete favorite.');
              console.error(err);
            }
          }}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FavoriteDetailsScreen;

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
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  favoriteDetails: {
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
  profileIcon: {
    alignSelf: 'center',
  },
  billerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  billerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  detailItem: {
    marginTop: 20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  detailText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  buttonContainer: {
  marginTop: 32,
  width: '100%',
  alignItems: 'center',
  },
  editButton: {
  backgroundColor: '#b3a0d6',
  borderRadius: 8,
  paddingVertical: 16,
  alignItems: 'center',
  width: '90%',
  marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#fff',
      borderColor: '#b3a0d6',
      borderWidth: 1.5,
      borderRadius: 8,
      paddingVertical: 16,
      alignItems: 'center',
      width: '90%',
      marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  addButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
  color: '#b3a0d6',
  fontSize: 16,
  fontWeight: '600',
},
});
