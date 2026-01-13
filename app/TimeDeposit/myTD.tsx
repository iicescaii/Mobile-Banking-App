import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the TimeDeposit interface
interface TimeDeposit {
  id: number;
  nickname: string;
  investment_amount: number | string; // depending on API response type
  investment_duration: number;
  interest: number | string;
}

const MyTimeDeposits = () => {
  const router = useRouter();
  const [timeDeposits, setTimeDeposits] = useState<TimeDeposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateMaturityDate = (months: number): string => {
      const today = new Date();
      today.setMonth(today.getMonth() + months);
      return today.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const fetchTimeDeposits = async (userId: string) => {
      try {
        const response = await axios.get(
          `http://192.168.1.6:5000/api/time-deposits/${userId}`
        );

        console.log("✅ Fetched deposits:", response.data);

        const mapped: TimeDeposit[] = response.data.map((item: any) => ({
          id: item.id,
          nickname: item.nickname || "Untitled",
          investment_amount: parseFloat(item.investment_amount),
          investment_duration: Number(item.investment_duration),
          interest: parseFloat(item.interest),
        }));

        setTimeDeposits(mapped);
      } catch (error) {
        console.error("❌ Error fetching time deposits:", error);
        Alert.alert("Error", "Failed to load time deposits");
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        fetchTimeDeposits(userId);
      } else {
        console.warn("⚠️ No user_id found in AsyncStorage.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('../Home')}
      >
        <Ionicons name="arrow-back-circle" size={40} color="#9993CC" />
      </TouchableOpacity>

      <Text style={styles.title}>My Time Deposits</Text>

      <TouchableOpacity
        style={[
          styles.startDepositContainer,
          timeDeposits.length >= 5 && { opacity: 0.5 },
        ]}
        onPress={() => {
          if (timeDeposits.length < 5) {
            router.push("./TDcreate");
          } else {
            Alert.alert(
              "Limit reached",
              "You cannot create more than 5 Time Deposits."
            );
          }
        }}
        disabled={timeDeposits.length >= 5}
      >
        <Ionicons name="add-circle-outline" size={30} color="#9993CC" />
        <Text style={styles.startDepositText}>Start another Time Deposit</Text>
        <Text style={styles.availableDeposits}>
          {timeDeposits.length} of 5 available Time Deposit
        </Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Loading...</Text>
      ) : timeDeposits.length > 0 ? (
        timeDeposits.map((deposit) => {
          const maturityDate = new Date();
          maturityDate.setMonth(
            maturityDate.getMonth() + deposit.investment_duration
          );
          const formattedMaturity = maturityDate.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          const payout =
            parseFloat(String(deposit.investment_amount)) +
            parseFloat(String(deposit.interest));

          return (
            <TouchableOpacity
              key={deposit.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "./TDdetails",
                  params: {
                    title: deposit.nickname,
                    maturityDate: formattedMaturity,
                    payout: payout.toFixed(2),
                  },
                })
              }
            >
              <View style={styles.circle}>
                <Text style={styles.circleText}>
                  {formattedMaturity.split(" ")[0]}
                </Text>
              </View>
              <Text style={styles.depositTitle}>{deposit.nickname}</Text>
              <Text style={styles.depositDetails}>
                Maturity: {formattedMaturity} | Payout: PHP {payout.toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.card}>
          <Text>No time deposits available</Text>
        </View>
      )}

      <View style={styles.archiveContainer}>
        <Text style={styles.archiveTitle}>Time Deposit Archives</Text>
        {timeDeposits.length > 0 ? (
          timeDeposits.filter((deposit) => {
            const today = new Date();
            const maturity = new Date();
            maturity.setMonth(maturity.getMonth() + deposit.investment_duration);
            return maturity < today;
          }).length > 0 ? (
            timeDeposits
              .filter((deposit) => {
                const today = new Date();
                const maturity = new Date();
                maturity.setMonth(maturity.getMonth() + deposit.investment_duration);
                return maturity < today;
              })
              .map((deposit) => (
                <TouchableOpacity key={deposit.id} style={styles.card}>
                  <View style={styles.archiveCircle}>
                    <Ionicons name="star" size={24} color="white" />
                  </View>
                  <Text style={styles.depositTitle}>{deposit.nickname}</Text>
                  <Text style={styles.depositDetails}>
                    Maturity: {new Date(
                      new Date().setMonth(new Date().getMonth() + deposit.investment_duration)
                    ).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    | Payout: PHP{" "}
                    {(
                      parseFloat(String(deposit.investment_amount)) +
                      parseFloat(String(deposit.interest))
                    ).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))
          ) : (
            <View style={styles.card}>
              <Text>No matured time deposits yet</Text>
            </View>
          )
        ) : (
          <View style={styles.card}>
            <Text>No time deposit archives available</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 15,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 1,
    marginBottom: "10%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#9993CC",
    marginBottom: 10,
    marginTop: "12%",
  },
  startDepositContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: "100%",
    alignSelf: "center",
  },
  startDepositText: {
    color: "#9993CC",
    fontSize: 18,
  },
  availableDeposits: {
    color: "#9993CC",
    fontSize: 14,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9993CC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  circleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  depositTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9993CC",
  },
  depositDetails: {
    fontSize: 14,
    color: "#9993CC",
    marginTop: 5,
  },
  archiveContainer: {
    marginTop: 40,
  },
  archiveTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9993CC",
    marginBottom: 10,
  },
  archiveCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9993CC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default MyTimeDeposits;
