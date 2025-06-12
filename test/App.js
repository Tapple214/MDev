import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import NameBadge from "./components/name-badge";
import TicTacToe from "./components/tic-tac-toe";

export default function App() {
  // return <NameBadge name="John Doe" />;
  return <TicTacToe />;
}
