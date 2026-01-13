import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ManageAccountsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        <Text style={styles.headerText}>Manage Accounts</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => router.push('/components/more/manage-accounts/add-remove')}  
      >
        <Ionicons name="add-circle" size={24} color="#9993CC" />
        <View style={styles.textContainer}>
          <Text style={styles.menuText}>Add or Remove Own Account</Text>
          <Text style={styles.menuDescription}>Add or remove your accounts</Text>
        </View>
      </TouchableOpacity>

      {/* Show or Hide Account */}
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => console.log('Show or Hide Account')}
      >
        <Ionicons name="eye-off" size={24} color="#9993CC" />
        <View style={styles.textContainer}>
          <Text style={styles.menuText}>Show or Hide Account</Text>
          <Text style={styles.menuDescription}>Select which accounts to display</Text>
        </View>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ManageAccountsScreen;

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

  textContainer: {
    flex: 1,
    marginLeft: 16,
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
