import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AccountCardProps = {
  accountType: string;
  balance: string;
  availableBalance: string;
  accountNumber: string;
};

const AccountCard: React.FC<AccountCardProps> = ({ accountType, balance, availableBalance, accountNumber }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.accountType}>{accountType}</Text>
      <Text style={styles.balance}>{balance}</Text>
      <Text style={styles.balance}>{availableBalance}</Text>
      <Text style={styles.accountNumber}>******{accountNumber.slice(-4)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#9993CC',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  accountType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  balance: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  accountNumber: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
});

export default AccountCard;
