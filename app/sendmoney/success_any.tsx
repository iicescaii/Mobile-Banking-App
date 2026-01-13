import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useGlobalSearchParams, router } from 'expo-router';
import { Ionicons as Icon } from '@expo/vector-icons';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const maskAccount = (num?: string) => num ? `********${num.slice(-4)}` : '';

const SuccessAnyScreen: React.FC = () => {
  const {
    amount,
    from,
    from_account,
    to,
    to_account,
    reference,
    created_at,
  } = useGlobalSearchParams();

  // Use ref for the card you want to capture
  const cardRef = useRef(null);

  const formattedDate = created_at
    ? new Date(created_at as string).toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })
    : new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' });

  const handleSaveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to save images.');
        return;
      }
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success', 'Image saved to your gallery!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Close icon */}
      <TouchableOpacity onPress={() => router.replace('/sendmoney/send_to_any')} style={styles.closeBtn}>
        <Icon name="close" size={28} color="#9993CC" />
      </TouchableOpacity>

      {/* Everything to be captured in the PNG goes inside ViewShot */}
      <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }} style={styles.card}>
        <Icon name="checkmark-circle" size={40} color="#9993CC" style={{ alignSelf: 'center', marginBottom: 8 }} />
        <Text style={styles.sentText}>Sent!</Text>
        <Text style={styles.amount}>PHP {Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        <View style={styles.separator} />

        {/* Transaction Details */}
        <View style={styles.row}>
          <Text style={styles.label}>To</Text>
          <View style={styles.rightAlign}>
            <Text style={styles.boldValue}>{to}</Text>
            <Text style={styles.subText}>{maskAccount(to_account as string)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>From</Text>
          <View style={styles.rightAlign}>
            <Text style={styles.boldValue}>{from}</Text>
            <Text style={styles.subText}>{maskAccount(from_account as string)}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.createdContainer}>
          <Text style={styles.createdHeader}>Created on</Text>
          <Text style={styles.created}>{formattedDate}</Text>
          <Text style={styles.createdHeader}>Reference no.</Text>
          <Text style={styles.created}>{reference || '-'}</Text>
        </View>
      </ViewShot>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleSaveImage}>
          <Icon name="image-outline" size={22} color="#9993CC" />
          <Text style={styles.actionText}>Save image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="share-social-outline" size={22} color="#9993CC" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SuccessAnyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-start',
  },
  sentText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9993CC',
    marginTop: 5,
    textAlign: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  separator: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: 15,
    borderStyle: 'dashed',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 12,
    color: '#9993CC',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
    color: '#222',
    flex: 1,
    paddingLeft: 10,
  },
  rightAlign: {
    flex: 2,
    alignItems: 'flex-start',
  },
  boldValue: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000',
  },
  subText: {
    fontSize: 12,
    color: '#777',
  },
  createdContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createdHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  created: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
}); 