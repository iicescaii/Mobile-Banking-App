import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const router = useRouter();
interface FooterButtonProps {
  label: string;
  icon: string;
  onPress: () => void;
}

const FooterButton: React.FC<FooterButtonProps> = ({ label, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.footerButton} onPress={onPress}>
      <Icon name={icon} size={32} color="#9993CC" />
      <Text style={styles.footerText}>{label}</Text>
    </TouchableOpacity>
  );
};

const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <FooterButton 
        label="Home" 
        icon="home" 
        onPress={() => alert('Home tapped')} 
      />
      <FooterButton 
        label="Send Money" 
        icon="send" 
        onPress={() => router.push('../../sendmoney/sendmoney')}
      />
      <FooterButton 
        label="Pay" 
        icon="receipt" 
        onPress={() => router.push('/components/paybills/Pay')}
      />
      <FooterButton 
        label="More" 
        icon="more-horiz" 
        onPress={() => router.push('/components/more/more')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',              // Arrange buttons horizontally
    justifyContent: 'space-between',   // Space buttons evenly
    alignItems: 'center',              // Center items vertically
    backgroundColor: '#FFFFFF',        // White background color
    paddingVertical: 5,               // Vertical padding for footer
    borderTopWidth: 1,                 // Optional border on top of footer
    borderTopColor: '#DDD',            // Border color
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 80,
    margin: 3,
  },
  footerText: {
    color: '#000000',  // Text color for labels
    fontSize: 12,
  },
});

export default Footer;
