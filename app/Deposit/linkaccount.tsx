import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StartLinking: React.FC = () => {
  const router = useRouter();

  const [selectedBank, setSelectedBank] = useState<string>(''); 
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [checkingUser, setCheckingUser] = useState(true); // Loading flag
  const [userError, setUserError] = useState<string | null>(null); // Error message

  // Get user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem('user_id');
        if (storedId) {
          setUserId(parseInt(storedId));
          setUserError(null);
        } else {
          setUserError('User ID not found. Please log in again.');
        }
      } catch (error) {
        setUserError('An error occurred while retrieving user information.');
      } finally {
        setCheckingUser(false);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    setModalVisible(true); // Open modal on mount
  }, []);

  const handleBankSelection = (bank: string) => {
    setSelectedBank(bank);
    setModalVisible(false);
  };

  const handleLinkNow = async () => {
    if (!selectedBank) {
      Alert.alert('Missing Bank', 'Please select a bank to link.');
      return;
    }
    if (!userId) {
      Alert.alert('User Error', 'User ID is missing. Cannot proceed.');
      return;
    }

    router.push({
      pathname: './linklogin',
      params: {
        selectedBank,
        userId: userId.toString(),
      },
    });
  };

  const handleBackPress = () => {
    router.push('./deposit');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back-circle" size={40} color="#9993CC" />
      </TouchableOpacity>

      {checkingUser ? (
        <Text style={{ textAlign: 'center', marginTop: 100 }}>Checking login status...</Text>
      ) : userError ? (
        <View style={{ marginTop: 100 }}>
          <Text style={{ textAlign: 'center', color: 'red', fontSize: 16 }}>{userError}</Text>
        </View>
      ) : (
        <View style={styles.linkContainer}>
          <Text style={styles.header}>Start Linking</Text>
          <View style={styles.bankContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.bankLogo}>{selectedBank || 'Choose a Bank'}</Text>
            </TouchableOpacity>
            <Ionicons name="swap-horizontal" size={30} color="#5F3D8F" />
            <Text style={styles.zenBankText}>Zenbank</Text>
          </View>

          <Text style={styles.instructions}>
            Click on "Link Now" and follow the instructions below:
          </Text>

          {[
            'Log in to your account using your credentials.',
            'Choose the account you wish to link to Zenbank.',
            'Check or adjust your transfer limits for smoother cash-ins.',
          ].map((step, index) => (
            <View style={styles.step} key={index}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={styles.stepDescription}>
                {step.replace('your account', `${selectedBank || 'your bank'} account`)}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.linkButton} onPress={handleLinkNow}>
            <Text style={styles.linkButtonText}>Link Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bank Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Bank</Text>
            {['BPI', 'Maya', 'Gcash', 'Seabank', 'BDO'].map((bank) => (
              <TouchableOpacity
                key={bank}
                style={styles.modalButton}
                onPress={() => handleBankSelection(bank)}
              >
                <Text style={styles.modalButtonText}>{bank}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  linkContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5F3D8F',
    textAlign: 'center',
    marginBottom: 20,
  },
  bankContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5F3D8F',
    marginHorizontal: 10,
  },
  zenBankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5F3D8F',
    marginLeft: 10,
    opacity: 0.7,
  },
  instructions: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  step: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5F3D8F',
    marginRight: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  linkButton: {
    backgroundColor: '#5F3D8F',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    padding: 15,
    backgroundColor: '#5F3D8F',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default StartLinking;
