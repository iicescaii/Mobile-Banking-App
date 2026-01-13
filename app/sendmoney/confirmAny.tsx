import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams, router } from 'expo-router';

const maskAccount = (num?: string) => num ? `********${num.slice(-4)}` : '';

export default function ConfirmAnyAccount() {
  const params = useGlobalSearchParams();
  const {
    user_id,
    amount,
    from_account_id,
    from_account_label,
    from_account_number,
    to_account_id,
    to_account_label,
    to_account_number,
    notes,
  } = params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.subtext}>You are about to send</Text>
          <Text style={styles.amount}>PHP {Number(amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</Text>
          <View style={styles.line} />
          <View style={styles.row}>
            <Ionicons name="wallet" size={24} color="#9993CC" style={styles.icon} />
            <View>
              <Text style={styles.label}>Send From {from_account_label}</Text>
              <Text style={styles.accountNum}>{maskAccount(from_account_number as string)}</Text>
            </View>
          </View>
          <Ionicons name="arrow-down" size={24} color="#9993CC" style={{ alignSelf: 'center', marginVertical: 8 }} />
          <View style={styles.row}>
            <Ionicons name="cash" size={24} color="#9993CC" style={styles.icon} />
            <View>
              <Text style={styles.label}>Send To {to_account_label || 'Recipient'}</Text>
              <Text style={styles.accountNum}>{maskAccount(to_account_number as string)}</Text>
            </View>
          </View>
          {notes ? (
            <View style={[styles.row, {marginTop: 12}]}>
              <Ionicons name="document-text" size={22} color="#9993CC" style={styles.icon} />
              <Text style={styles.notes}>{notes}</Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={() => router.push({
          pathname: './enter_pin_any',
          params: {
            user_id,
            amount,
            from_account_id,
            from_account_label,
            from_account_number,
            to_account_id,
            to_account_label,
            to_account_number,
            notes
          }
        })}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    backgroundColor: '#9993CC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  subtext: { fontSize: 16, color: '#444', marginBottom: 8, fontWeight: '600' },
  amount: { fontSize: 32, fontWeight: '700', color: '#333', marginBottom: 8 },
  line: { borderTopWidth: 1, borderTopColor: '#EEE', marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginRight: 16 },
  label: { fontWeight: '600', fontSize: 16, color: '#333' },
  accountNum: { fontSize: 15, color: '#888', marginTop: 2 },
  notes: { fontSize: 15, color: '#666', flex: 1, flexWrap: 'wrap' },
  confirmButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});