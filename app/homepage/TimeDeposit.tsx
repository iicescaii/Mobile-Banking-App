import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TimeDepositProps {
  amount?: string;  // Made optional
  description: string;
  onPress: () => void;
}

const TimeDeposit: React.FC<TimeDepositProps> = ({ amount, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>Time Deposit</Text>
      {amount && <Text style={styles.amount}>{amount}</Text>}  {/* Render only if amount exists */}
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#9993CC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  amount: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 10,
  },
});

export default TimeDeposit;
