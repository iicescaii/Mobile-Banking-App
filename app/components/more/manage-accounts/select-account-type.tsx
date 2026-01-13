import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const SelectAccountType = () => {
  const [selectedAccountType, setSelectedAccountType] = useState<string>('');
  const router = useRouter(); // Initialize useRouter

  const accountTypes = ['Checking Account', 'Savings Account'];

  const handleSelectAccount = (account: string) => {
    setSelectedAccountType(account);
    // Navigate to AddOwnAccount screen and pass selected account type as a parameter
    router.push(`/more/manage-accounts/add-own-account?accountType=${account}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Go back')}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Account Type</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Account Type List */}
        {accountTypes.map((account, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.accountOption,
              selectedAccountType === account && styles.selectedOption,
            ]}
            onPress={() => handleSelectAccount(account)}
          >
            <Text style={styles.accountText}>{account}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectAccountType;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#9993CC', // Deep Purple color
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  accountOption: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#9993CC',
  },
  accountText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});
