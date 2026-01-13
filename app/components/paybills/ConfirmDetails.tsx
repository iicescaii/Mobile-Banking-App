import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams, router } from 'expo-router';
import axios from 'axios';

const getStringParam = (param: string | string[] | undefined) =>
  Array.isArray(param) ? param[0] : param || '';

const ConfirmDetails: React.FC = () => {
  const params = useGlobalSearchParams();
  const [loading, setLoading] = useState(false);

  // Extract all payment data from params (snake_case only)
  const {
    amount,
    biller_name,
    biller_id,
    subscriber_account_name,
    subscriber_account_number,
    pay_from_account_nickname,
    pay_from_account_number,
    pay_from_account_balance,
    notes,
    user_id,
    pay_from_account_id,
  } = params;

  // Handle confirm payment
const handleConfirm = async () => {
  // Prepare paymentData for PIN entry
  const paymentData = {
    user_id,
    pay_from_account_id,
    pay_from_account_number,
    pay_from_account_nickname,
    pay_from_account_balance,
    subscriber_account_number,
    subscriber_account_name,
    amount,
    notes,
    biller_id,
    biller_name,
  };

  const favoriteId = getStringParam(params.favorite_id);

  // Redirect to EnterPin screen with all payment data
  router.push({
    pathname: '/components/paybills/enter_pin',
    params: {...paymentData, favorite_id: favoriteId },
  });
};
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Details</Text>
      </View>

      {/* Body Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.subtext}>Total amount to be deducted</Text>
          <Text style={styles.amount}>PHP {amount}</Text>

          <View style={styles.line}></View>

        {/* Payment Details Card */}
        <View style={styles.infoCard}>
          {/* From Account */}
          <View style={styles.infoRow}>
            <Ionicons name="wallet" size={22} color="#9993CC" style={styles.infoIcon} />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoTitle}>From Account</Text>
              <Text style={styles.infoMain}>{pay_from_account_nickname}</Text>
              <Text style={styles.infoSub}>••••••{pay_from_account_number?.slice(-4)}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Biller */}
          <View style={styles.infoRow}>
            <Ionicons name="business" size={22} color="#9993CC" style={styles.infoIcon} />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoTitle}>Biller</Text>
              <Text style={styles.infoMain}>{biller_name}</Text>
            </View>
          </View>

          {/* Subscriber Account Number */}
          <View style={styles.infoRow}>
            <Ionicons name="card" size={22} color="#9993CC" style={styles.infoIcon} />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoTitle}>Subscriber Account Number</Text>
              <Text style={styles.infoMain}>{subscriber_account_number}</Text>
            </View>
          </View>

          {/* Subscriber Account Name */}
          <View style={styles.infoRow}>
            <Ionicons name="person" size={22} color="#9993CC" style={styles.infoIcon} />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoTitle}>Subscriber Account Name</Text>
              <Text style={styles.infoMain}>{subscriber_account_name}</Text>
            </View>
          </View>
            {/* Notes */}
            {notes ? (
              <View style={styles.infoRow}>
                <Ionicons name="document-text" size={22} color="#9993CC" style={styles.infoIcon} />
                <View style={styles.infoTextBox}>
                  <Text style={styles.infoTitle}>Notes</Text>
                  <Text style={styles.infoMain}>{notes}</Text>
                </View>
              </View>
            ) : null}
          </View>
            </View>
        {/* Reminders */}
        <View style={styles.remindersBox}>
          <Text style={styles.remindersTitle}>Important Reminders:</Text>
          <Text style={styles.remindersText}>
            1. Except for scheduled transactions, all payments made after the 10pm cut-off will be processed on the next banking day.
          </Text>
          <Text style={styles.remindersText}>
            2. Ensure that all details are correct. Any errors should be coordinated directly with your biller.
          </Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#9993CC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  subtext: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    fontWeight: '600',
  },
  amount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  referenceLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
  referenceCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
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
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  cardDetail: {
    fontSize: 14,
    color: '#555',
  },
  label: {
    color: '#777',
    fontSize: 14,
    marginTop: 6,
  },
  boldDetail: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
  },
  remindersBox: {
    backgroundColor: '#F8F4FF',
    borderColor: '#9993CC',
    borderWidth: 1,
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  remindersTitle: {
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 15,
  },
  remindersText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  infoCard: {
  borderRadius: 16,
  padding: 18,
  paddingVertical: 0,
  paddingHorizontal: 5,
  marginBottom: 0},
infoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 14,
},
infoIcon: {
  marginRight: 20,
},
infoTextBox: {
  flex: 1,
},
infoTitle: {
  fontSize: 13,
  color: '#9993CC',
  fontWeight: '600',
  marginBottom: 2,
},
infoMain: {
  fontSize: 16,
  color: '#333',
  fontWeight: '600',
},
infoSub: {
  fontSize: 13,
  color: '#888',
  marginTop: 1,
},
divider: {
  borderBottomWidth: 1,
  borderBottomColor: '#EEE',
  marginVertical: 10,
},
});