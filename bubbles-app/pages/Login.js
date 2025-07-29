// Client ids

// expoClientId:
// "355374652560-bv8a0b9eh4joa9oo32lefa4ci403tkdp.apps.googleusercontent.com",
// iosClientId:
// "355374652560-bv8a0b9eh4joa9oo32lefa4ci403tkdp.apps.googleusercontent.com",
// androidClientId:
// "355374652560-bv8a0b9eh4joa9oo32lefa4ci403tkdp.apps.googleusercontent.com",
// webClientId:
// "355374652560-bv8a0b9eh4joa9oo32lefa4ci403tkdp.apps.googleusercontent.com",

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login({ navigation }) {
  const handleSignIn = () => {
    // Simple navigation without authentication
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.generalContainer}>
      <Image source={require("../assets/login.jpeg")} style={styles.image} />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#EEDCAD",
    height: "100%",
    paddingVertical: 15,
  },
  button: {
    padding: 15,
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
});
