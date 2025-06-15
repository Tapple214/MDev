import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import NameBadge from "./components/name-badge";
import TicTacToe from "./components/tic-tac-toe";
import Calculator from "./components/calculator";
import FoodApp from "./components/food-app";

export default function App() {
  // return <NameBadge name="Apple 🍎" />;
  // return <TicTacToe />;
  // return <Calculator />;
  return <FoodApp />;
}
