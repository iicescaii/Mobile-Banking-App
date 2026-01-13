import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';

export default function PinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');


  const rawParams = useLocalSearchParams();
  const user_id = Array.isArray(rawParams.user_id) ? rawParams.user_id[0] : rawParams.user_id;
  const from_account = Array.isArray(rawParams.from_account) ? rawParams.from_account[0] : rawParams.from_account;
  const to_account = Array.isArray(rawParams.to_account) ? rawParams.to_account[0] : rawParams.to_account;
  const amount = Array.isArray(rawParams.amount) ? rawParams.amount[0] : rawParams.amount;
  const note = Array.isArray(rawParams.note) ? rawParams.note[0] : rawParams.note;

  const handlePinPress = (number: string) => {
    if (pin.length < 6) {
      const newPin = pin + number;
      setPin(newPin);

      if (newPin.length === 6) {
        setTimeout(() => {

          router.push({
            pathname: './fingerprint',
            params: {
              user_id,
              from_account,
              to_account,
              amount,
              note,
            },
          });
        }, 500);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter your 6-digit{'\n'}PIN to continue</Text>

        <View style={styles.pinContainer}>
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                pin.length > index && styles.pinDotFilled
              ]}
            />
          ))}
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPin}>
            Forgot PIN? <Text style={styles.clickHere}>click here.</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.key}
              onPress={() => handlePinPress(number.toString())}
            >
              <Text style={styles.keyText}>{number}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.key} />
          <TouchableOpacity
            style={styles.key}
            onPress={() => handlePinPress('0')}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.key}
            onPress={handleDelete}
          >
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: '#7B6EF6',
  },
  forgotPin: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  clickHere: {
    color: '#7B6EF6',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 280,
  },
  key: {
    width: '33.33%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 24,
    color: '#333',
  },
});