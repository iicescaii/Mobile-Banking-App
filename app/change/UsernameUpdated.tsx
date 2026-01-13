import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UsernameUpdated: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={() => router.back()}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <Ionicons name="checkmark-circle" size={100} color="green" />
      <Text style={styles.title}>Well done!</Text>
      <Text style={styles.message}>You have successfully changed your username</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('./ManageLogin')}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 30, backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' },
  close: { position: 'absolute', top: 40, left: 20 },
  closeText: { fontSize: 28 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  message: { fontSize: 14, color: '#555', marginTop: 10, textAlign: 'center' },
  button: { backgroundColor: '#9993CC', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 10, marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default UsernameUpdated;
