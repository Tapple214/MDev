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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

export default function Login({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const updateForm = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

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

  const handleAuth = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigation.navigate("Home");
      } else {
        await signup(formData.email, formData.password, formData.name);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => setIsLogin(true) },
        ]);
      }
    } catch (error) {
      console.log("Auth error:", error.code, error.message);
      const errorMessage =
        errorMessages[error.code] || `Authentication error: ${error.message}`;
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (field, placeholder, props = {}) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={formData[field]}
      onChangeText={(value) => updateForm(field, value)}
      {...props}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require("../assets/login.jpeg")}
            style={styles.image}
          />

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? "Welcome Back!" : "Join Bubbles!"}
            </Text>

            {renderInput("email", "Email", {
              keyboardType: "email-address",
              autoCapitalize: "none",
              autoCorrect: false,
            })}

            {!isLogin &&
              renderInput("name", "Name", {
                autoCapitalize: "words",
                autoCorrect: false,
              })}

            {renderInput("password", "Password", { autoCapitalize: "none" })}

            {!isLogin &&
              renderInput("confirmPassword", "Confirm Password", {
                autoCapitalize: "none",
              })}

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

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#EEDCAD", flex: 1 },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingVertical: 15 },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  formContainer: { paddingHorizontal: 20, flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
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
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  switchButton: { alignItems: "center", paddingVertical: 10 },
  switchText: {
    color: "#4A90E2",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
