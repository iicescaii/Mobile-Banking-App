import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, FontAwesome  } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AddRemoveScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        <Text style={styles.headerText}>Add or Remove Own Acc...</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => router.push('/components/more/manage-accounts/select-account-type')}  // Navigate to Select Account Type
            >
                <Ionicons name="add-circle" size={28} color="#9993CC" />
                <Text style={styles.addButtonText}>Add Own Account</Text>
                <Ionicons name="chevron-forward" size={24} color="#9993CC" />
            </TouchableOpacity>

            {/* Existing Savings Account */}
            <View style={styles.accountCard}>
                <Text style={styles.accountTitle}>Savings Account</Text>
                <View style={styles.accountInfo}>
                    <FontAwesome name="university" size={24} color="#9993CC" />
                    <View style={styles.accountText}>
                    <Text style={styles.accountAccountName}>To SA w/ ATM W/O PASBK-INDIVIDUAL</Text>
                    <Text style={styles.accountNumber}>******5596</Text>
                    </View>
                    <TouchableOpacity style={styles.removeButton}>
                    <Ionicons name="trash-bin" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>


            {/* Important Reminder Section */}
            <View style={styles.reminderContainer}>
                    <View style={styles.reminderTitleContainer}>
                        <Ionicons name="information-circle" size={20} color="#9993CC" />
                        <Text style={styles.reminderTitle}>Important Reminders:</Text>
                    </View>
                <Text style={styles.reminderText}>1. Adding accounts is subject to ZenBank’s Terms and Conditions.</Text>
                <Text style={styles.reminderText}>2. Only Own and Joint OR accounts can be added.</Text>
            </View>
        </ScrollView>
    </View>
  );
};

export default AddRemoveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  backButton: {
    marginRight: 10,
  },

  header: {
    backgroundColor: '#9993CC',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },

  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
  },

  addButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },

  accountCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'column',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  accountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,  
  },

  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },

  accountText: {
    marginLeft: 20, 
    flex: 1,  
  },

  accountAccountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },

  accountNumber: {
    fontSize: 16,
    color: '#999',
  },

  removeButton: {
    backgroundColor: '#F44336',  
    padding: 8,
    borderRadius: 50,  
  },

  reminderContainer: {
    backgroundColor: '#E1DFEC',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1, 
    borderColor: '#9993CC',  
  },
  reminderTitleContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 8,
  },
  
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,  
  },

  reminderText: {
    fontSize: 14,
    color: '#999',
    paddingLeft: 20,
  },
});
