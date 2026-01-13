import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../homepage/Footer';

const SendMoney = () => {
  const router = useRouter();

  const handleOwnAccountPress = () => {
    router.push('./ownacc'); // Replace with actual route
  };

  const handleZenAccountPress = () => {
    router.push('./send_to_any'); // Replace with actual route
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Send Money</Text>
      </View>

      {/* Own Account */}
      <TouchableOpacity style={styles.button} onPress={handleOwnAccountPress}>
        <Ionicons name="paper-plane" size={30} color="#9993CC" />
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>Own Account</Text>
          <Text style={styles.buttonDescription}>Send Money to your own accounts</Text>
        </View>
      </TouchableOpacity>

      {/* Any Zen Account */}
      <TouchableOpacity style={styles.button} onPress={handleZenAccountPress}>
        <Ionicons name="cash-outline" size={30} color="#9993CC" />
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>Any Zen Account</Text>
          <Text style={styles.buttonDescription}>Send Money to other ZenBank accounts</Text>
        </View>
      </TouchableOpacity>

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    backgroundColor: '#9993CC',
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B4B4B',
  },
  buttonDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default SendMoney;
