import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Correct the IconNames type to match the Ionicons set
type IconNames = 
  | "add"
  | "swap-horizontal"       // Ensure valid icon names like "swap" instead of "swap-vert"
  | "receipt"
  | "bar-chart"   // Replace show-chart with bar-chart
  | "card"
  | "star"; 

type MenuButtonProps = {
  label: string;
  icon: IconNames;  // Ensure the icon is a valid Ionicon name
  onPress: () => void;
};

const MenuButton: React.FC<MenuButtonProps> = ({ label, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {/* Pass icon name properly */}
      <Ionicons name={icon} size={24} color="#9993CC" />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginBottom: 10,
    width: '30%',
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 12,
    color: '#9993CC',
    marginTop: 5,
  },
});

export default MenuButton;
