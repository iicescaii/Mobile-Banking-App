import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddOwnAccount: React.FC = () => {
  const [accountType, setAccountType] = useState('Checking Account');
  const [accountNumber, setAccountNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Go back')}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Own Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Account Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Account Type</Text>
          <TouchableOpacity style={styles.accountTypeBox} onPress={() => setAccountType('Checking Account')}>
            <Text style={styles.accountTypeText}>{accountType}</Text>
          </TouchableOpacity>
        </View>

        {/* Account Number */}
        <View style={styles.section}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
        </View>

        {/* Nickname */}
        <View style={styles.section}>
          <Text style={styles.label}>Preferred Nickname (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter preferred nickname"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        {/* Important Reminders */}
        <View style={styles.reminderBox}>
          <Text style={styles.reminderTitle}>Important Reminders:</Text>
          <Text style={styles.reminderText}>
            1. Adding accounts is subject to ZenBank's Terms and Conditions.
          </Text>
          <Text style={styles.reminderText}>2. Only Own and Joint OR accounts can be added.</Text>
        </View>

        {/* Consent */}
        <View style={styles.section}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, isChecked && styles.checkboxChecked]} 
              onPress={() => setIsChecked(!isChecked)}
            >
              {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I hereby ratify and confirm the enrollment of my co-depositors in ZenBank Online Banking and irrevocably consent...
            </Text>
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddOwnAccount;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#9993CC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  accountTypeBox: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  accountTypeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  reminderBox: {
    backgroundColor: '#EDE8FF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  reminderText: {
    fontSize: 14,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#9993CC',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#9993CC',
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 