import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AccountCardProps {
  accountType: string;
  balance: string;
  availableBalance: string;
  accountNumber: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ accountType, balance, availableBalance, accountNumber }) => {
  return (
    <View style={Cardstyles.card}>
      {/* Container for icon and account type, displayed in a row */}
      <View style={Cardstyles.accountInfo}>
        <Icon name="account-balance" size={40} color="#FFFFFF" style={Cardstyles.icon} />

        {/* Account Type */}
        <Text style={Cardstyles.accountType}>{accountType}</Text>
      </View>

      {/* Account Number */}
      <Text style={Cardstyles.accountNumber}>•••••••••{accountNumber.slice(-4)}</Text>

      {/* Balance Information */}
      <Text style={Cardstyles.cardBalance}>{balance}</Text>
      <Text style={Cardstyles.cardAvailableBalance}>{availableBalance}</Text>
    </View>
  );
};

const Cardstyles = StyleSheet.create({
  card: {
    backgroundColor: '#9993CC',          // Purple background color
    padding: 20,                          // Padding inside the card
    borderRadius: 10,                     // Rounded corners
    marginVertical: 10,                   // Vertical margin for spacing between cards
    elevation: 5,                         // Shadow for Android
    shadowColor: '#000',                  // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.5,                    // Shadow radius for blur effect
  },
  accountInfo: {
    flexDirection: 'row',                 // Arrange icon and account type horizontally
    alignItems: 'center',                 // Align items in the center vertically
    marginBottom: 10,                     // Space between the icon+account type and account number
  },
  icon: {
    marginRight: 10,                     // Space between the icon and the account type text
  },
  accountType: {
    fontSize: 18,                         // Font size for the account type
    color: '#FFFFFF',                     // White text color
    fontWeight: '600',                    // Bold text
  },
  accountNumber: {
    fontSize: 16,                         // Font size for the account number
    color: '#FFFFFF',
    marginBottom: 15,                     // Space between account number and balance
  },
  cardBalance: {
    fontSize: 16,                         // Font size for the balance
    color: '#FFFFFF',
    marginBottom: 5,                      // Space between balance and available balance
  },
  cardAvailableBalance: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,                      // Add some bottom margin for spacing
  },
});

export default AccountCard;
