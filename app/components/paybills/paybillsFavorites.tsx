import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../utils/tokenStorage';

// Define the type for a favorite biller
interface FavoriteBiller {
  favorite_id: number;
  user_id: number;
  biller_id: number;
  biller_name: string;
  subscriber_account_number: string;
  subscriber_account_name: string;
  favorite_nickname: string;
  created_at?: string;
  updated_at?: string;
}

const PayBillsFavoritesScreen = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteBiller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error('No token found');
        const res = await axios.get<FavoriteBiller[]>('http://172.20.10.4:5000/api/favorite-billers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data || []);
      } catch (err) {
        setFavorites([]);
      }
      setLoading(false);
    };
    fetchFavorites();
  }, []);

  const filteredFavorites = favorites.filter(fav =>
    fav.favorite_nickname?.toLowerCase().includes(search.toLowerCase()) ||
    fav.biller_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFavoritePress = (fav: FavoriteBiller) => {
    router.push({
      pathname: '/components/paybills/PayBillForm',
      params: {
        favorite_id: fav.favorite_id.toString(),
        biller_id: fav.biller_id.toString(),
        biller_name: fav.biller_name,
        subscriberAccountNumber: fav.subscriber_account_number, 
        subscriberName: fav.subscriber_account_name,           
        favorite_nickname: fav.favorite_nickname,
        },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/components/paybills/SelectBillers')} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        <Text style={styles.headerText}>Pay Bills</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search favorites"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Favorite List */}
      {loading ? (
        <ActivityIndicator size="large" color="#9993CC" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.favoriteListContainer}>
          {filteredFavorites.length === 0 ? (
            <Text style={styles.endOfList}>No favorites found</Text>
          ) : (
            filteredFavorites.map((fav) => (
              <TouchableOpacity style={styles.favoriteItem} key={fav.favorite_id} onPress={() => handleFavoritePress(fav)}>
                <Ionicons name="person-circle" size={40} color="#9993CC" />
                <View style={styles.favoriteInfo}>
                  <Text style={styles.favoriteName}>{fav.favorite_nickname}</Text>
                  <Text style={styles.favoriteDetails}>{fav.biller_name}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
      {filteredFavorites.length > 0 && (
        <View style={styles.endOfListContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#9993CC" style={{ marginRight: 6 }} />
          <Text style={styles.endOfList}>You have reached the end of the list</Text>
        </View>
      )}
        </ScrollView>
      )}
    </View>
  );
};

export default PayBillsFavoritesScreen;

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
  addButton: {
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 20,
    marginHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  favoriteListContainer: {
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteInfo: {
    flex: 1,
    marginLeft: 16,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  favoriteDetails: {
    fontSize: 14,
    color: '#666',
  },
  endOfList: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
    backButton: {
    marginRight: 10,
  },
  endOfListContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
});