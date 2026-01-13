// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const Index: React.FC = () => {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('./components/login/Login'); // matches app/LoginPage.tsx
  };

  return (
    <View style={styles.container}>
      <Image source={require('./components/images/zenbank-logo.png')} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 40,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#9993CC',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Index;
