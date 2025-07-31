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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin && !name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!isLogin && password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigation.navigate("Home");
      } else {
        await signup(email, password, name);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => setIsLogin(true) },
        ]);
      }
    } catch (error) {
      console.log("Auth error:", error.code, error.message);
      let errorMessage = "An error occurred";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage =
            "No account found with this email. Please sign up first.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = `Authentication error: ${error.message}`;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // For Google Sign-In, you'll need to implement Expo Google Sign-In
    // This is a placeholder for now
    Alert.alert("Coming Soon", "Google Sign-In will be implemented soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>💬</Text>
            </View>
            <Text style={styles.appTitle}>Bubbles</Text>
            <Text style={styles.appSubtitle}>Connect with friends</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? "Welcome back!" : "Join the community"}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? "Sign in to your account" : "Create your account"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
            />

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                secureTextEntry
              />
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? "Sign In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
            >
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  formContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#6B7280",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#1F2937",
  },
  button: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#9CA3AF",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  switchButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  switchText: {
    color: "#6366F1",
    fontSize: 14,
    fontWeight: "500",
  },
});
