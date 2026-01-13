import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SavedFavoriteScreen = () => {
  const router = useRouter();
  const { nickname } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Checkmark icon */}
      <View style={styles.checkmark}>
        <Ionicons name="checkmark" size={40} color="#fff" />
      </View>

      {/* Texts */}
      <Text style={styles.title}>Favorite Details Updated!</Text>
      <Text style={styles.description}>
        You can now send money to <Text style={{fontWeight: 'bold', color: '#9993CC'}}>{nickname || 'this biller'}</Text> by selecting from your favorites.
      </Text>

      {/* OK button */}
      <TouchableOpacity style={styles.okButton} onPress={() => router.push('/components/more/manage-favorites/sendMoneyFavorites/sendMoneyFaves')}>
        <Text style={styles.okText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SavedFavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  checkmark: {
    width: 80,
    height: 80,
    backgroundColor: '#4CAF50',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  okButton: {
    backgroundColor: '#9993CC',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    position: 'absolute',  
    bottom: 24,  
  },
  okText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
