import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EnterPinForPassword: React.FC = () => {
  const [pin, setPin] = useState('');
  const router = useRouter();

  const handleDigitPress = (digit: string) => {
    if (pin.length < 6) {
      const updated = pin + digit;
      setPin(updated);
      if (updated.length === 6) {
        // simulate success
        setTimeout(() => router.push('./PasswordUpdated'), 300);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Enter your 6-digit PIN to continue</Text>

      <View style={styles.pinContainer}>
        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.pinBox}>
            <Text style={styles.pinDot}>{pin[index] ? '•' : ''}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={() => router.push('./Forgot')}>
        <Text style={styles.forgotText}>
          Forgot <Text style={styles.link}>PIN?</Text> click here.
        </Text>
      </TouchableOpacity>

      <View style={styles.numpad}>
        {[...'1234567890'].map((digit) => (
          <TouchableOpacity
            key={digit}
            style={styles.digit}
            onPress={() => handleDigitPress(digit)}
          >
            <Text style={styles.digitText}>{digit}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.digit} onPress={handleBackspace}>
          <Text style={styles.digitText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#fff', alignItems: 'center' },
  closeButton: { alignSelf: 'flex-start' },
  closeText: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: 'bold', marginVertical: 30, textAlign: 'center' },
  pinContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  pinBox: { width: 40, height: 50, margin: 5, borderRadius: 8, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center' },
  pinDot: { fontSize: 28 },
  forgotText: { fontSize: 14, color: '#999', marginBottom: 30 },
  link: { color: '#9993CC', fontWeight: 'bold' },
  numpad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  digit: { width: 70, height: 70, margin: 10, borderRadius: 35, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  digitText: { fontSize: 24, fontWeight: 'bold' },
});

export default EnterPinForPassword;
