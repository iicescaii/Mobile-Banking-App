import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import axios from 'axios';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../../utils/tokenStorage';

// Step 1: Define BankAccount interface
interface BankAccount {
  account_id: number;
  user_id: number;
  account_number: string;
  account_label: string;
  available_balance: number;
}

interface ApiResponse {
  success: boolean;
  accounts: BankAccount[];
  count?: number;
  message?: string;
}

const SelectAccount = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const params = useGlobalSearchParams();

  const fetchAccounts = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No token found');
      const response = await axios.get<ApiResponse>('http://172.20.10.4:5000/api/bank-accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAccounts(response.data.accounts);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to load accounts');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server. Please check your internet connection.');
        } else if (error.response?.status === 404) {
          setError('API endpoint not found. Please check the server configuration.');
        } else {
          setError(error.response?.data?.message || 'Failed to load accounts. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAccounts();
  };

  const handleSelect = (item: BankAccount) => {
    router.push({
      pathname: '/components/paybills/PayBillForm',
      params: {
        biller_id: params.biller_id,
        biller_name: params.biller_name,
        subscriberAccountNumber: params.subscriberAccountNumber,
        subscriberName: params.subscriberName,
        amount: params.amount,
        notes: params.notes,
        selectedAccountId: item.account_id,
        nickname: item.account_label,
        accountNumber: item.account_number,
        availableBalance: item.available_balance,
        favorite_id: params.favoriteId,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#AFA3D8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAccounts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send To</Text>
      </View>
      {/* Account List */}
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.account_id.toString()}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)} style={styles.accountCard}>
            <Text style={styles.accountLabel}>{item.account_label}</Text>
            <Text style={styles.accountNumber}>
              {'*'.repeat(item.account_number.length - 4) + item.account_number.slice(-4)}
            </Text>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              PHP {Number(item.available_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No accounts found</Text>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#AFA3D8']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#AFA3D8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 12,
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  accountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  accountNumber: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
    letterSpacing: 2,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#AFA3D8',
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectAccount;