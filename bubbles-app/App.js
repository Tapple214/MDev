import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";



export default function BubblesApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Sreen name="Home" component={Home} />
        <Stack.Sreen name="BubbleDetails" component={BubbleDetails} />
        <Stack.Sreen name="BubbleBook" component={BubbleBook} />
        <Stack.Sreen name="BubbleBudies" component={BubbleBudies} />
        <Stack.Sreen name="CreateBubble" component={CreateBubble} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
