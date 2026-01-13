import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const FingerprintScreen = () => {
  const router = useRouter();

  const handleOk = () => {
    // You can implement real biometric auth here later
    router.push('/components/paybills/enter_pin');
  };

  const handleCancel = () => {
    router.back(); // Go back to previous page
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()}>
         <Ionicons name="chevron-back" size={24} color="#fff" />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>Pay Bills</Text>
        </View>

      <Image source={require('../images/zenbank-logo.png')} style={styles.image} />
      <Text style={styles.text}>Use Fingerprint to continue</Text>

      <TouchableOpacity style={styles.okButton} onPress={handleOk}>
        <Text style={styles.okText}>OK</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FingerprintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#9993CC',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  image: {
    width: 150,
    height: 150,
    marginTop: 70,
    marginBottom: 50,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 22,
    color: '#333',
    marginBottom: 150,
    fontWeight: 'bold',
  },
  okText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelText: {
    color: '#9993CC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, 
  },
  
  cancelButton: {
    borderWidth: 1,
    borderColor: '#9993CC',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#fff', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, 
  },  
});
