import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import Header from "./homepage/Header";
import AccountCard from "./homepage/AccountCard";
import MenuButton from "./homepage/MenuButton";
import TimeDeposit from "./homepage/TimeDeposit";
import Footer from "./homepage/Footer";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface BankAccount {
  account_id: number;
  account_type: string;
  balance: string;
  available_balance: string;
  account_label: string;
  account_number: string;
}

interface TimeDeposit {
  id: number;
  investment_amount: string;
  investment_duration: number;
  interest: string;
  nickname: string;
  created_at: string;
}

const Home: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [timeDeposits, setTimeDeposits] = useState<TimeDeposit[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem("user_data");
        const parsed = stored ? JSON.parse(stored) : null;
        const id = parsed?.user_id;
        if (!id) {
          console.error("No user ID found");
          return;
        }
        setUserId(id);

        console.log(id);
        // Fetch bank accounts
        const bankAccountRes = await axios.get(
          `http://localhost:5000/api/bank-account/${id}`
        );
        setBankAccounts(bankAccountRes.data);

        // Fetch time deposits
        const tdRes = await axios.get(
          `http://localhost:5000/api/time-deposits/${id}`
        );
        setTimeDeposits(tdRes.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header onNotificationPress={() => alert("Notifications Tapped!")} />

      {/* Render bank accounts dynamically */}
      <View style={styles.cardContainer}>
        {bankAccounts.map((account) => (
          <AccountCard
            key={account.account_id}
            accountType={account.account_label || account.account_type}
            balance={`Available Balance PHP ${parseFloat(
              account.balance
            ).toFixed(2)}`}
            availableBalance={`Current Balance PHP ${parseFloat(
              account.available_balance
            ).toFixed(2)}`}
            accountNumber={account.account_number}
          />
        ))}
      </View>

      <View style={styles.menuCardContainer}>
        <View style={styles.buttonContainer}>
          <MenuButton
            label="Deposit"
            icon="add"
            onPress={() => router.push('../TimeDeposit/myTD')}
          />
          <MenuButton
            label="Send Money"
            icon="swap-vert"
            onPress={() => alert("Send Money tapped")}
          />
          <MenuButton
            label="Transaction"
            icon="receipt"
            onPress={() => alert("Transaction tapped")}
          />
          <MenuButton
            label="Investment"
            icon="show-chart"
            onPress={() => alert("Investment tapped")}
          />
          <MenuButton
            label="Card"
            icon="credit-card"
            onPress={() => alert("Card tapped")}
          />
          <MenuButton
            label="Favorites"
            icon="star"
            onPress={() => alert("Favorites tapped")}
          />
        </View>
      </View>

      {/* Render time deposits dynamically */}
      <View style={styles.cardContainer}>
        {timeDeposits.map((td) => (
          <TouchableOpacity
            key={td.id}
            onPress={() => router.push("../myTD")}
            activeOpacity={0.7}
          >
            <TimeDeposit
              amount={`PHP ${parseFloat(td.investment_amount).toFixed(2)}`}
              description="Sit back, relax and see your time deposit savings grow"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  cardContainer: {
    padding: 15,
  },
  menuCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 17,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 17,
  },
});

export default Home;
