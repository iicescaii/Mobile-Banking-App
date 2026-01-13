import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '../../../utils/tokenStorage';

const ManageFavoritesScreen = () => {
  const router = useRouter();
  const [payBillsFavorites, setPayBillsFavorites] = useState([]);
  const [sendMoneyFavorites, setSendMoneyFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error('No token found');
        // Fetch favorite billers
        const favRes = await axios.get('http://192.168.1.7:5000/api/favorite-billers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayBillsFavorites(favRes.data || []);
        // Fetch send money favorites
        const sendMoneyRes = await axios.get('http://192.168.1.7:5000/api/favorite-receivers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSendMoneyFavorites(sendMoneyRes.data || []);
      } catch (err) {
        setPayBillsFavorites([]);
        setSendMoneyFavorites([]);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const handleSendMoneyPress = async () => {
    const token = await getToken();
    if (!token) {
      Alert.alert('Login Required', 'Please log in to use this feature.', [
        { text: 'OK', onPress: () => router.replace('/components/login/Login') }
      ]);
      return;
    }
    if (loading) return;
    if (sendMoneyFavorites.length === 0) {
      router.push('/components/more/manage-favorites/sendMoneyFavorites/NoFavoritesScreen');
    } else {
      router.push('/components/more/manage-favorites/sendMoneyFavorites/sendMoneyFaves');
    }
  };

  const handlePayBillsPress = () => {
    if (loading) return;
    if (payBillsFavorites.length === 0) {
      router.push('/components/more/manage-favorites/payBillsFavorites/NoFavoritesScreen');
    } else {
      router.push('/components/more/manage-favorites/payBillsFavorites/payBillsFavoritesScreen');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/components/more/more')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Favorites</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Send to Zen Account */}
        <TouchableOpacity style={styles.menuItem} onPress={handleSendMoneyPress}>
          <Image
            source={require('../../images/zenbank-logo.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Send Money to Any Zenbank Account</Text>
            <Text style={styles.menuDescription}>Add, edit, delete a favorite receiver</Text>
          </View>
        </TouchableOpacity>

        {/* Pay Bills */}
        <TouchableOpacity style={styles.menuItem} onPress={handlePayBillsPress} disabled={loading}>
          <Ionicons name="document-text-outline" size={32} color="#9993CC" />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Pay Bills</Text>
            <Text style={styles.menuDescription}>Add, edit, delete a favorite biller</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ManageFavoritesScreen;

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
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingLeft: 16,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },

  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  textContainer: {
    flex: 1,
    marginLeft: 8,
  },

  menuText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },

  menuDescription: {
    fontSize: 14,
    color: '#424242',
    marginTop: 4,
  },

  backButton: {
    marginRight: 10,
  },
});
