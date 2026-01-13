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
        <Icon name="notifications" size={40} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',              // Align items horizontally
    justifyContent: 'space-between',   // Space between text and icon
    alignItems: 'center',              // Align items to the center vertically
    backgroundColor: '#9993CC',        // Purple background color
    width: '100%',                     // Ensures the header takes full width of the screen
    paddingHorizontal: 20,             // Horizontal padding for better spacing
    paddingVertical: 15,               // Vertical padding for balanced height
    elevation: 7,                      // Adds shadow for better visibility
  },
  headerTitle: {
    fontSize: 24,                      // Adjust font size for responsiveness
    color: '#FFFFFF',                  // White text for the title
    fontWeight: 'bold',                 // Bold text style
    flex: 1,                           // Makes the title take available space
    textAlign: 'left',                 // Align title to the left
  },
});

export default Header;
