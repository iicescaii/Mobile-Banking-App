import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NoFavoritesScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/components/more/manage-favorites/manage-faves')} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Favorites</Text>
              <TouchableOpacity onPress={() => router.push('/components/more/manage-favorites/sendMoneyFavorites/add-receiver-faves')} style={styles.addButtonIcon}>
              <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require('../../../images/star-icon.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>No favorites yet</Text>
        <Text style={styles.description}>
          You can save a favorite by tapping the star after sending money.
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/components/more/manage-favorites/sendMoneyFavorites/add-receiver-faves')} >
          <Text style={styles.addButtonText}>Add Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoFavoritesScreen;

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

  backButton: {
    marginRight: 10,
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    flex: 1,
  },

  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    maxWidth: 260,
  },

  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },

  addButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonIcon: {
    marginLeft: 'auto',
  },
});
