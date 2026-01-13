import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from './homepage/Footer'; // Adjust path as needed
import axios from 'axios';
import { getToken } from './utils/tokenStorage';

const API_BASE_URL = 'http://192.168.14.251:5000/api';

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
};

const formatAmount = (amount: number) => {
  return `PHP ${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userAccountIds, setUserAccountIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }
      // Fetch user info from /me endpoint
      const userRes = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userId = userRes.data.user?.user_id;
      if (!userId) throw new Error('No user ID found');
      // Now fetch transactions
      const response = await axios.get(`${API_BASE_URL}/user-transactions/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.transactions) {
        setTransactions(response.data.transactions);
        setUserAccountIds(response.data.accounts?.map((acc: any) => acc.account_id) || []);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to load transactions');
      }
    } catch (error) {
      setError('Failed to load transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
  }, []);

  const getDisplayInfo = (transaction: any) => {
    const { type, to_account, from_account } = transaction;
    const isUserSender = userAccountIds.includes(from_account);
    const isUserReceiver = userAccountIds.includes(to_account);

    if (type === 'deposit_external') {
      return {
        icon: 'cash-outline',
        color: '#34D399',
        description: 'Deposit from External Bank',
        label: transaction.to_label || 'External Bank',
        accountNum: transaction.to_number || '—',
        isCredit: true,
        reference: transaction.reference_code || '',
      };
    }
    if (type === 'pay_bill') {
      return {
        icon: 'document-text-outline',
        color: '#EF4444',
        description: `Paid bill to ${transaction.to_label || 'Biller'}`,
        label: transaction.to_label || 'Biller',
        accountNum: transaction.subscriber_account_number || '—',
        isCredit: false,
        reference: transaction.reference_code || '',
      };
    }
    if (type === 'send_to_own' || type === 'send_to_any') {
      const isDebit = isUserSender;
      const isCredit = isUserReceiver;
      return {
        icon: isCredit ? 'arrow-down-circle' : 'arrow-up-circle',
        color: isCredit ? '#34D399' : '#EF4444',
        description: isCredit
          ? `Received from ${transaction.from_label || 'Unknown'}`
          : `Sent to ${transaction.to_label || 'Unknown'}`,
        label: isCredit
          ? transaction.from_label || 'Unknown'
          : transaction.to_label || 'Unknown',
        accountNum: isCredit
          ? transaction.from_number || '—'
          : transaction.to_number || '—',
        isCredit,
        reference: transaction.reference_code || '',
      };
    }
    // fallback
    return {
      icon: 'help-circle-outline',
      color: '#888',
      description: 'Unknown Transaction',
      label: '',
      accountNum: '—',
      isCredit: false,
      reference: '',
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Transaction History</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#9993CC" />
        ) : error ? (
          <Text style={styles.noTransactionsText}>{error}</Text>
        ) : transactions.length === 0 ? (
          <Text style={styles.noTransactionsText}>No transactions yet.</Text>
        ) : (
          transactions.map((transaction, index) => {
            const info = getDisplayInfo(transaction);

            return (
              <View key={index} style={styles.transactionItem}>
                <Ionicons
                  name={info.icon as any}
                  size={24}
                  color={info.color}
                  style={styles.icon}
                />
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{info.description}</Text>
                  <Text style={styles.accountNumber}>Account #{info.accountNum}</Text>
                  <Text style={styles.transactionDate}>{formatFullDate(transaction.timestamp)}</Text>
                  {info.reference ? (
                    <Text style={styles.referenceText}>Ref: {info.reference}</Text>
                  ) : null}
                </View>
                <Text style={[styles.amount, info.isCredit ? styles.credit : styles.debit]}>
                  {info.isCredit
                    ? formatAmount(transaction.amount)
                    : `-${formatAmount(transaction.amount)}`}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, padding: 15, backgroundColor: '#F7F7F7' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B3E9C',
    textAlign: 'center',
    marginVertical: 20,
  },
  noTransactionsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: { marginRight: 15 },
  transactionInfo: { flex: 1 },
  transactionDescription: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  accountNumber: { fontSize: 12, color: '#555', marginBottom: 3 },
  transactionDate: { fontSize: 14, color: '#6B3E9C' },
  referenceText: { fontSize: 12, color: '#888', marginTop: 2 },
  amount: { fontSize: 16, fontWeight: 'bold' },
  credit: { color: '#34D399' },
  debit: { color: '#EF4444' },
});

export default TransactionHistory;