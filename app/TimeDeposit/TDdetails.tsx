import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TimeDepositDetails: React.FC = () => {
  const router = useRouter();

  // Data for time deposit
  const timeDepositDetails = {
    accountNumber: '₱30,000',
    investmentAmount: '₱30,000.00',
    term: '12 Months',
    interestRate: '4.75%',
    interestEarned: '₱1,426.28',
    payoutAtMaturity: '₱31,426.28',
    maturityDate: '03 Sep 2025',
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={40} color="#9993CC" />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>Time deposit details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Account number</Text>
          <Text style={styles.value}>{timeDepositDetails.accountNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Investment amount</Text>
          <Text style={styles.value}>{timeDepositDetails.investmentAmount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Term</Text>
          <Text style={styles.value}>{timeDepositDetails.term}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Interest rate (p.a)</Text>
          <Text style={styles.value}>{timeDepositDetails.interestRate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Interest earned at maturity</Text>
          <Text style={styles.value}>{timeDepositDetails.interestEarned}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Payout at maturity</Text>
          <Text style={styles.value}>{timeDepositDetails.payoutAtMaturity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Maturity</Text>
          <Text style={styles.value}>{timeDepositDetails.maturityDate}</Text>
        </View>
        <Text style={styles.note}>
          Interest earned is subject to 20% withholding tax
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5F3D8F',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default TimeDepositDetails;
