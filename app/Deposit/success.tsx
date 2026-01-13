import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const LinkSuccess: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank Linked Successfully!</Text>
      <Text style={styles.message}>
        Your bank account is now linked to Zenbank. You can now make deposits.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('../home')}>
        <Text style={styles.buttonText}>Go to Deposit Page</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LinkSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5F3D8F',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#5F3D8F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
