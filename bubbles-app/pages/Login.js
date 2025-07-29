import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Login({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "1039980441242-4p6g2rvp1e9p3p6p6r1v7v7v7v7v7v7v.apps.googleusercontent.com",
    iosClientId:
      "603581775295-851ag1nphqt4tov1pofg0e9u1md2kh1t.apps.googleusercontent.com",
    androidClientId:
      "603581775295-3jeo8mvvah7p80acv86u65j5fi0avsiv.apps.googleusercontent.com",
    webClientId:
      "603581775295-rtaoqr6irikf29ca5rjbnm23ili9lgqg.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          // Save user info to Firestore
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
          });
          navigation.navigate("Home");
        })
        .catch((error) => {
          Alert.alert("Login error", error.message);
        });
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.generalContainer}>
      <Image source={require("../assets/login.jpeg")} style={styles.image} />
      <TouchableOpacity
        style={styles.button}
        // onPress={() => promptAsync()}
        onPress={() => navigation.navigate("Home")}
        disabled={!request}
      >
        <Text>Sign in with Google</Text>
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
    padding: 10,
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 15,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 35,
  },
});
