import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimeDepositProps {
  amount: string;
  description: string;
}

const TimeDeposit: React.FC<TimeDepositProps> = ({ amount, description }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Time Deposit</Text>
      <Text style={styles.cardAmount}>{amount}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#9993CC',
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  cardTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardAmount: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
  },
});

export default TimeDeposit;
