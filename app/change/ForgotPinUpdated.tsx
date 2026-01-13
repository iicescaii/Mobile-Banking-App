import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PinUpdated = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color="green" />
      <Text style={styles.title}>Well done!</Text>
      <Text style={styles.subtitle}>You have successfully changed your 6-digit PIN</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('./index')}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 14, color: '#555', marginVertical: 10, textAlign: 'center' },
  button: { backgroundColor: '#9993CC', paddingHorizontal: 60, paddingVertical: 15, borderRadius: 10, marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default PinUpdated;