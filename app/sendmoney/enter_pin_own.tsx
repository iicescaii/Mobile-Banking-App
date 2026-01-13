import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const API_BASE_URL = 'http://192.168.1.7:5000/api';

export default function EnterPinOwn() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract transfer data from params
  const {
    user_id,
    from_account_id,
    from_account_number,
    from_account_label,
    to_account_number,
    amount,
    notes,
  } = params;

  const handlePress = (value: string) => {
    if (loading) return;
    if (value === 'back') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }
    if (!/^\d$/.test(value) || pin.length >= 6) return;
    const newPin = pin + value;
    setPin(newPin);
    if (newPin.length === 6) {
      setTimeout(() => handlePinSubmit(newPin), 300);
    }
  };

  const handlePinSubmit = async (submittedPin: string) => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No auth token');
      // 1. Verify PIN
      const verifyRes = await axios.post(`${API_BASE_URL}/verify-pin`, {
        user_id,
        pin: submittedPin,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (!verifyRes.data.success) {
        Alert.alert('Error', 'Invalid PIN');
        setPin('');
        setLoading(false);
        return;
      }

      // 2. Process transfer
      const transferRes = await axios.post(`${API_BASE_URL}/transfer-own`, {
        user_id,
        from_account_id,
        from_account_number,
        from_account_label,
        to_account_number,
        amount,
        notes,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (transferRes.data.success) {
        router.replace({
          pathname: './success_own',
          params: {
            amount,
            from: from_account_label,
            from_account: from_account_number,
            to_account: to_account_number,
            reference: transferRes.data.reference || '',
            created_at: new Date().toISOString(),
          },
        });
      } else {
        Alert.alert('Error', transferRes.data.message || 'Transfer failed');
        setPin('');
      }
    } catch (err) {
      Alert.alert('Error', 'An error occurred. Please try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const renderKey = (label: string | number) => (
    <TouchableOpacity
      key={label}
      style={[styles.key, label === 'back' ? styles.backspaceKey : undefined]}
      onPress={() => handlePress(String(label))}
      disabled={loading}
    >
      {label === 'back'
        ? <Ionicons name="backspace" size={24} color="#9993CC" />
        : <Text style={styles.keyText}>{label}</Text>
      }
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={28} color="#9993CC" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter your 6-digit PIN to continue</Text>
      <View style={styles.pinContainer}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.pinDot, pin.length > i ? styles.filledPinDot : null]}>
            {pin.length > i && <View style={styles.filledDot} />}
          </View>
        ))}
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9993CC" />
          <Text style={styles.loadingText}>Processing transfer...</Text>
        </View>
      )}
      <View style={styles.pad}>
        {[1,2,3,4,5,6,7,8,9,'',0,'back'].map((item, i) =>
          item !== '' ? renderKey(item) : <View key={`empty-${i}`} style={styles.key} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#fff' },
  closeBtn: { position: 'absolute', top: 40, left: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, marginTop: 50, paddingHorizontal: 50 },
  pinContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 },
  pinDot: { width: 50, height: 65, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f6f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3 },
  filledPinDot: { borderColor: '#9993CC', backgroundColor: '#f0f0f0' },
  filledDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#9993CC' },
  pad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 },
  key: { width: '30%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', margin: '1.5%', borderRadius: 12, elevation: 1, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  keyText: { fontSize: 28, color: '#333', fontWeight: 'bold' },
  loadingContainer: { alignItems: 'center', marginVertical: 20 },
  loadingText: { marginTop: 10, color: '#9993CC', fontSize: 16 },
  backspaceKey: { backgroundColor: '#f8f8f8' },
});