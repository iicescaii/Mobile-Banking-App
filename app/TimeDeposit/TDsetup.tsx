import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const TDsetup: React.FC = () => {
  const router = useRouter();

  // ✅ Properly parse values as strings
  const {
    investmentAmount = "",
    investmentDuration = "",
    interest = "",
    nickname = "",
  } = useLocalSearchParams() as Record<string, string>;

  const handleSubmit = () => {
    router.push({
      pathname: "./TDconfirmation",
      params: { investmentAmount, investmentDuration, interest, nickname },
    });
  };

  // ⏳ Dynamically calculate maturity date
  const calculateMaturityDate = (months: number): string => {
    const today = new Date();
    today.setMonth(today.getMonth() + months);
    return today.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const maturityDate = calculateMaturityDate(Number(investmentDuration));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.investmentContainer}>
        <Text style={styles.sectionTitle}>Investment Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Investment Amount</Text>
          <Text style={styles.detailText}>₱{investmentAmount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Term</Text>
          <Text style={styles.detailText}>{investmentDuration}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Nickname</Text>
          <Text style={styles.detailText}>{nickname}</Text>
        </View>
      </View>

      {/* Time Deposit Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Time Deposit Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Interest rate (p.a)</Text>
          <Text style={styles.detailText}>
            {(
              (parseFloat(interest) / parseFloat(investmentAmount)) *
              100
            ).toFixed(2)}
            %
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Interest earned at maturity</Text>
          <Text style={styles.detailText}>
            ₱{parseFloat(interest).toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Payout at maturity</Text>
          <Text style={styles.detailText}>
            ₱
            {(
              parseFloat(investmentAmount) + parseFloat(interest)
            ).toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Early Withdrawal</Text>
          <Text style={styles.detailText}>Free</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Date of maturity</Text>
          <Text style={styles.detailText}>{maturityDate}</Text>
        </View>
      </View>

      <Text style={styles.footerText}>
        No Document Stamp Tax (DST) for early withdrawals within the first 5
        days. DST will apply after this period.
      </Text>
      <Text style={styles.footerText}>
        Each customer is insured up to ₱500,000 by PDIC.
      </Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Confirm Time Deposit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F7F7F7",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B3E9C",
    marginTop: 60,
    marginBottom: 20,
  },
  investmentContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailsContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B3E9C",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#6B3E9C",
  },
  detailText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B3E9C",
  },
  footerText: {
    fontSize: 12,
    color: "#6B3E9C",
    textAlign: "center",
    marginVertical: 10,
  },
  proceedButton: {
    backgroundColor: "#6B3E9C",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#9993CC",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "30%",
  },
});

export default TDsetup;
