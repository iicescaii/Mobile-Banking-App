import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // This will be used to handle navigation

const Footer: React.FC = () => {
  const router = useRouter();  // Initialize useRouter hook for navigation

  return (
    <View style={styles.footerContainer}>
      <View style={styles.container}>
        {/* Home Tab Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('../home')}  // Navigate to the homepage (index.tsx)
        >
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

        {/* Send Money Tab Button */}
        <TouchableOpacity style={styles.button}onPress={() => router.push('/sendmoney/sendmoney')}>
          <Ionicons name="swap-vertical" size={24} color="white" />
          <Text style={styles.buttonText}>Send Money</Text>
        </TouchableOpacity>

        {/* Pay Tab Button */}
        <TouchableOpacity style={styles.button} onPress={() => { /* Handle Pay Tab */ }}>
          <Ionicons name="receipt" size={24} color="white" />
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>

        {/* More Tab Button */}
        <TouchableOpacity style={styles.button} onPress={() => { /* Handle More Tab */ }}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          <Text style={styles.buttonText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#9993CC',
    paddingVertical: 10,
    position: 'absolute',  // Positioning the footer at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,  // Ensure footer is above other content
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    flex: 1,  // Spread buttons across the footer evenly
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Footer;
