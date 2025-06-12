import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

const { width } = Dimensions.get("window");
const GRID_SIZE = width * 0.8; // 80% of device width
const CELL_SIZE = GRID_SIZE / 3;
const BORDER_WIDTH = 4;

const board = [
  ["O", "O", "X"],
  ["X", "O", "O"],
  ["X", "X", "O"],
];

export default function TicTacToe() {
  //   useEffect(() => {
  //     const lockOrientation = async () => {
  //       try {
  //         await ScreenOrientation.lockAsync(
  //           ScreenOrientation.OrientationLock.PORTRAIT_UP
  //         );
  //       } catch (error) {
  //         console.error("Failed to lock orientation:", error);
  //       }
  //     };

  //     lockOrientation();

  //     // Cleanup function to unlock orientation when component unmounts
  //     return () => {
  //       ScreenOrientation.unlockAsync();
  //     };
  //   }, []);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.cell,
                  rowIndex < 2 && styles.cellBorderBottom,
                  colIndex < 2 && styles.cellBorderRight,
                ]}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  grid: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: "#fff",
    marginHorizontal: width * 0.1, // 10% margin on each side
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cellBorderRight: {
    borderRightWidth: BORDER_WIDTH,
    borderRightColor: "#000",
  },
  cellBorderBottom: {
    borderBottomWidth: BORDER_WIDTH,
    borderBottomColor: "#000",
  },
  cellText: {
    fontSize: CELL_SIZE * 0.6, // Responsive text size
    fontWeight: "bold",
    color: "#000",
  },
});
