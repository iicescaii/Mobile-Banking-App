import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const SignupSuccess: React.FC = () => {
  const router = useRouter();

  const handleOkPress = () => {
    router.push("../login/Login");
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner} />

      {/* Image & Text */}
      <View style={styles.content}>
        <Image
          source={require("../images/Registered.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          ZenBank Online Banking sign-up successful!!
        </Text>
      </View>

      {/* Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleOkPress}>
          <Text style={styles.primaryText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBanner: {
    height: 60,
    backgroundColor: "#9993CC",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    padding: 30,
  },
  primaryButton: {
    backgroundColor: "#9993CC",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SignupSuccess;
