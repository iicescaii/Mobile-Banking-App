import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Footer from '../homepage/Footer'; 

const MoreScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>More</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subheading}>Account & Security</Text>

        {/* Menu Options */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/components/more/manage-accounts/manage-accounts')}>
          <Ionicons name="person" size={28} color="#9993CC" />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Manage Accounts</Text>
            <Text style={styles.menuDescription}>Add and secure your accounts</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Manage Card')}>
          <Ionicons name="card" size={28} color="#9993CC" />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Manage Card</Text>
            <Text style={styles.menuDescription}>Edit your card security and settings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Manage Login')}>
          <Ionicons name="lock-closed" size={28} color="#9993CC" />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Manage Login</Text>
            <Text style={styles.menuDescription}>Manage login options</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Update Profile')}>
          <Ionicons name="person-circle" size={28} color="#9993CC" />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Update Profile</Text>
            <Text style={styles.menuDescription}>Update your personal information</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/components/more/manage-favorites/manage-faves')}>
          <Ionicons name="heart" size={28} color="#9993CC" />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Manage Favorites</Text>
            <Text style={styles.menuDescription}>Manage all favorites</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => console.log('About ZenBank')}>
          <Ionicons name="information-circle" size={28} color="#9993CC" />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>About ZenBank Online</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logout} onPress={() => console.log('Logout')}>
          <Ionicons name="log-out" size={28} color="#BB271A" />
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Footer /> {/* Adding Footer at the bottom */}
    </View>
  );
};

export default MoreScreen;

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

  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 10,
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
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },

  menuDescription: {
    fontSize: 16,
    color: '#424242',
    marginTop: 4,
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingLeft: 16,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
});
