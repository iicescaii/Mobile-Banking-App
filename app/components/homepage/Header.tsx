import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import MaterialIcons

interface HeaderProps {
  onNotificationPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNotificationPress }) => {
  return (
    <View style={styles.header}>
      {/* Header Text */}
      <Text style={styles.headerTitle}>My Accounts</Text>

      {/* Notification Bell Icon */}
      <TouchableOpacity onPress={onNotificationPress}>
        <Icon name="notifications" size={40} color="#FFFFFF"/>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',             // Align items horizontally
    justifyContent: 'space-between',  // Space between text and icon
    alignItems: 'flex-end',           // Align the items at the bottom
    paddingHorizontal: 15,            // Horizontal padding
    backgroundColor: '#9993CC',       // Purple background color
    height: 120,                      // Set a fixed height for the header
    paddingBottom: 10,      // Set the background color of the header
  },
  headerTitle: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
    margin: 5,
  },
});

export default Header;
