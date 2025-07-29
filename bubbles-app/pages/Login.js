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
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as AuthSession from "expo-auth-session";

export default function Login({ navigation }) {
  // const redirectUri = AuthSession.makeRedirectUri({
  //   // native: "bubbles://redirect",
  //   useProxy: true,
  // });

  // const redirectUri = "https://auth.expo.io/@tapple/bubbles-app";

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  console.log("hi");
  console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "355374652560-bv8a0b9eh4joa9oo32lefa4ci403tkdp.apps.googleusercontent.com",
    iosClientId:
      "355374652560-7074thqjtjf55j2h1050hvq0n3a4tohu.apps.googleusercontent.com",
    androidClientId:
      "355374652560-f1cah0s5bc6f9cb9i4d543hdnjril21u.apps.googleusercontent.com",
    webClientId:
      "355374652560-bv8a0b9eh4joa9oo32lefa4ci403tkdp.apps.googleusercontent.com",
    redirectUri,
  });

  console.log(redirectUri);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const userDocRef = doc(db, "users", user.uid);

          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            navigation.navigate("Home");
          } else {
            // Save user info to Firestore
            await setDoc(doc(db, "users", user.uid), {
              name: user.displayName,
              email: user.email,
            });
            navigation.navigate("Home");
          }
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
        onPress={() => promptAsync()}
        // onPress={() => navigation.navigate("Home")}
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
