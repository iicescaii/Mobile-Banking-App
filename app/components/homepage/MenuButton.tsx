import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import the icon set

interface MenuButtonProps {
  label: string; // 'label' is required
  onPress: () => void; // 'onPress' is also required
  icon: string; // Now 'icon' is required for this component
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, onPress, icon }) => {
  // Apply rotation only if the icon is "swap-vert"
  const iconStyle = icon === "swap-vert" ? { transform: [{ rotate: '90deg' }] } : {};

  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Icon name={icon} size={40} color="#9993CC" style={iconStyle} />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuCardContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 80,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  menuText: {
    color: '#000000',
    fontSize: 12,
    marginTop: 5,
  },
});

export default MenuButton;
