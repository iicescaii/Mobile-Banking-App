import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ArrowDownCircle } from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransferScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fromAccount, setFromAccount] = useState('2004123456789011');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) setUserId(storedUserId);
    };
    getUserId();
  }, []);

  const handleConfirm = async () => {
    if (!fromAccount || !toAccount || !amount) {
      return Alert.alert('Error', 'All fields are required');
    }

    if (fromAccount === toAccount) {
      return Alert.alert('Error', 'Sender and recipient cannot be the same');
    }

    try {
      const response = await axios.post('http://192.168.1.7:5000/api/transfer', {
        from_account: fromAccount,
        to_account: toAccount,
        amount: parseFloat(amount),
        note,
      });

      if (response.data.success) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-PH', {
          year: 'numeric', month: 'long', day: 'numeric',
        }) + ' ' + now.toLocaleTimeString('en-PH');

        const ref = `PC-${now.toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(Math.random() * 99999999)}`;

        router.push({
          pathname: './success',
          params: {
            amount: amount.toString(),
            from_label: 'My Savings',
            from_account: fromAccount,
            to_label: 'Recipient',
            to_account: toAccount,
            date: formattedDate,
            ref,
          },
        });
      } else {
        Alert.alert('Failed', response.data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Server error');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="Recipient Account Number"
              value={toAccount}
              onChangeText={setToAccount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Note (optional)"
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.content}>
            <Text style={styles.amountText}>PHP {parseFloat(amount).toFixed(2)}</Text>
            <ArrowDownCircle size={24} color="#7C65E6" style={{ alignSelf: 'center', marginVertical: 16 }} />
            <Text style={styles.confirmText}>From: {fromAccount}{"\n"}To: {toAccount}</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer</Text>
      </View>
      {renderStep()}
      {step === 3 && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#7C65E6' },
  headerTitle: { fontSize: 18, color: '#fff', marginLeft: 10 },
  content: { padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 16, marginBottom: 20 },
  button: { backgroundColor: '#7C65E6', padding: 16, borderRadius: 12, alignItems: 'center' },
  confirmButton: { margin: 20, backgroundColor: '#7C65E6', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  amountText: { fontSize: 32, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' },
  confirmText: { fontSize: 16, textAlign: 'center', color: '#333' },
});