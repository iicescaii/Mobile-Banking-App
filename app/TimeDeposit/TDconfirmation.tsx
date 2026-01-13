import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// Helper function to safely get first string from param which can be string or string[]
function getFirstParam(param: string | string[] | undefined): string {
  if (!param) return "";
  return Array.isArray(param) ? param[0] : param;
}

const TDconfirmation: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const investmentAmount = getFirstParam(params.investmentAmount);
  const investmentDuration = getFirstParam(params.investmentDuration);
  const interest = getFirstParam(params.interest);
  const nickname = getFirstParam(params.nickname);

  const handleDone = () => {
    // Just navigate back, no API call
    router.push("./myTD");
  };

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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("./myTD")}
      ></TouchableOpacity>

      <Text style={styles.title}>Time deposit details</Text>

      <View style={styles.detailContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Investment amount</Text>
          <Text style={styles.detailValue}>{investmentAmount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Term</Text>
          <Text style={styles.detailValue}>{investmentDuration}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Interest rate (p.a)</Text>
          <Text style={styles.detailValue}>
            {(
              (parseFloat(interest) / parseFloat(investmentAmount)) *
              100
            ).toFixed(2)}
            %
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Interest earned at maturity</Text>
          <Text style={styles.detailValue}>
            ₱{parseFloat(interest).toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payout at maturity</Text>
          <Text style={styles.detailValue}>
            ₱
            {(
              parseFloat(investmentAmount) + parseFloat(interest)
            ).toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Maturity</Text>
          <Text style={styles.detailValue}>{maturityDate}</Text>
        </View>
      </View>

      <Text style={styles.footerText}>
        Interest earned is subject to 20% withholding tax
      </Text>

      <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
        <Text style={styles.buttonText}>Done</Text>
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
    fontSize: 27,
    fontWeight: "bold",
    color: "#8681B6",
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  detailContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: "#8681B6",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B3E9C",
  },
  footerText: {
    fontSize: 12,
    color: "#6B3E9C",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: "#6B3E9C",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TDconfirmation;
