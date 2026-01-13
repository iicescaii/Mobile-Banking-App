import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Define the Biller interface
interface Biller {
  billers_id: number;
  biller_name: string;
  category?: string;
  is_active: boolean;
}

const SelectBillers = () => {
  const [billers, setBillers] = useState<Biller[]>([]); // Use the Biller type
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Fetch billers from the backend when the component mounts
  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const response = await axios.get('http://192.168.1.7:5000/api/billers'); // Make sure your backend API endpoint is correct
        console.log('Billers fetched from API:', response.data.billers); // Log the fetched billers
        setBillers(response.data.billers); // Set billers in state
      } catch (error) {
        console.error('Error fetching billers:', error);
      }
    };
    fetchBillers();
  }, []);

  const handleBillerSelect = (biller_id: number, biller_name: string) => {
    router.push(`/components/more/manage-favorites/payBillsFavorites/add-biller-faves?biller_id=${biller_id}&biller_name=${encodeURIComponent(biller_name)}`);
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Billers</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search all billers"
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Filter and List Billers */}
      <FlatList
        data={billers.filter((biller) =>
          biller.biller_name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter billers based on search input
        )}
        keyExtractor={(item) => item.billers_id.toString()} // Using billers_id as key
        contentContainerStyle={styles.billerList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.billerItem} onPress={() => handleBillerSelect(item.billers_id, item.biller_name, )}>
            <Text style={styles.billerText}>{item.biller_name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default SelectBillers;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9993CC',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchContainer: {
    backgroundColor: '#F4F4F4',
    margin: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  favoriteText: { color: '#9993CC', fontSize: 14 },
  billerList: { paddingHorizontal: 20 },
  billerItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  billerText: { fontSize: 15, color: '#333' },
});
