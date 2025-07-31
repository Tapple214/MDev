import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";

// Custom hooks
import { useAuth } from "../contexts/AuthContext";

export default function Login({ navigation }) {
  // Custom Hook
  const { login, signup } = useAuth();

  // States
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // login or signup
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  // Form input management
  const updateForm = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const renderInput = (field, placeholder, props = {}) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={formData[field]}
      onChangeText={(value) => updateForm(field, value)}
      {...props}
    />
  );

  // To check whether the form is filled in correctly
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }
    if (!isLogin && !formData.name) {
      Alert.alert("Error", "Please enter your name");
      return false;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    if (!isLogin && formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // What to send to the user when an error occurs
  const errorMessages = {
    "auth/user-not-found":
      "No account found with this email. Please sign up first.",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "An account with this email already exists",
    "auth/weak-password": "Password is too weak",
    "auth/invalid-email": "Invalid email address",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",
  };

  // What to do during and after the authentication process
  const handleAuth = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      // If form is for login
      if (isLogin) {
        await login(formData.email, formData.password);
        navigation.navigate("Home");
      } else {
        // If form is for signup
        await signup(formData.email, formData.password, formData.name);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => setIsLogin(true) },
        ]);
      }
    } catch (error) {
      const errorMessage =
        errorMessages[error.code] || `Authentication error: ${error.message}`;
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.generalContainer}>
      <Image source={require("../assets/login.jpeg")} style={styles.image} />

      <Text style={styles.title}>
        {isLogin ? "Welcome To Bubbles!" : "Join Bubbles!"}
      </Text>

      {/* Email */}
      {renderInput("email", "Email", {
        keyboardType: "email-address",
        autoCapitalize: "none",
        autoCorrect: false,
      })}

      {/* Name; Only show if form is for signup */}
      {!isLogin &&
        renderInput("name", "Name", {
          autoCapitalize: "words",
          autoCorrect: false,
        })}

      {/* Password */}
      {renderInput("password", "Password", { autoCapitalize: "none" })}

      {/* Confirm Password; Only show if form is for signup */}
      {!isLogin &&
        renderInput("confirmPassword", "Confirm Password", {
          autoCapitalize: "none",
        })}

      {/* Confirm button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#EEDCAD" />
        ) : (
          <Text style={styles.buttonText}>
            {isLogin ? "Sign In" : "Sign Up"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Switch button */}
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#EEDCAD",
    height: "100%",
    paddingTop: 50,
    paddingBottom: 100,
    paddingHorizontal: 20,
    flex: 1,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#452A17",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 15,
  },
  buttonText: { color: "#FEFADF", fontSize: 16, fontWeight: "bold" },
  switchText: {
    color: "#452A17",
    fontSize: 14,
    textDecorationLine: "underline",
    alignSelf: "center",
  },
});
